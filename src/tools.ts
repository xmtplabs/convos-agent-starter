import type { ToolSpec } from "@openuidev/lang-core";
import { z } from "zod";

export type ToolOperation = "query" | "mutation";

export type ToolExecutionContext = {
  signal: AbortSignal;
};

export type PublicTool = {
  operation: ToolOperation;
  description: string;
  input: z.ZodType;
  output: z.ZodType;
  execute: (
    input: Record<string, unknown>,
    context: ToolExecutionContext,
  ) => Promise<unknown>;
};

export type PublicToolRegistry = Record<string, PublicTool>;

const groupSummary = z.object({
  conversation_id: z.string(),
  created_at: z.string(),
  is_active: z.boolean(),
  kind: z.enum(["group", "dm"]),
  member_count: z.number().int().nonnegative(),
  name: z.string(),
});

const member = z.object({
  inbox_id: z.string(),
  member_kind: z.enum(["agent", "member"]).default("member"),
  name: z.string(),
});

const eventResult = z.object({
  accepted: z.literal(true),
  deduped: z.boolean(),
});

/**
 * Every registered tool is public. Query tools may be used during static
 * rendering; mutation tools are available only through an explicit browser
 * action and require a caller-supplied idempotency key.
 */
export const tools = {
  get_group: {
    operation: "query",
    description: "Get the public summary for this conversation group.",
    input: z.object({}),
    output: groupSummary,
    async execute(_input: Record<string, unknown>, { signal }: ToolExecutionContext) {
      const response = await fetch("https://artifacts.internal/v1/group", {
        signal,
      });
      if (!response.ok) throw new Error("The group summary is unavailable.");
      return response.json();
    },
  },
  get_members: {
    operation: "query",
    description:
      "List the public profiles of people in this conversation group.",
    input: z.object({}),
    output: z.array(member),
    async execute(_input: Record<string, unknown>, { signal }: ToolExecutionContext) {
      const response = await fetch(
        "https://artifacts.internal/v1/group/members",
        { signal },
      );
      if (!response.ok) throw new Error("The member list is unavailable.");
      return response.json();
    },
  },
  send_to_agent: {
    operation: "mutation",
    description:
      "Send an idempotent public event to the group assistant after a visitor explicitly activates an action.",
    input: z.object({
      idempotencyKey: z.string().min(1).max(128),
      body: z.record(z.string(), z.unknown()),
    }),
    output: eventResult,
    async execute(input: Record<string, unknown>, { signal }: ToolExecutionContext) {
      const response = await fetch(
        "https://artifacts.internal/v1/agent/events",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
          signal,
        },
      );
      if (!response.ok) throw new Error("The assistant event was not accepted.");
      return response.json();
    },
  },
} satisfies PublicToolRegistry;

export type ToolName = keyof typeof tools;
export const toolRegistry: PublicToolRegistry = tools;
export const toolNames = Object.freeze(
  Object.keys(tools) as ToolName[],
);

/** Stable prompt descriptors for every publicly callable tool. */
export const toolDescriptors: ToolSpec[] = Object.entries(tools).map(
  ([name, tool]) => ({
    name,
    description: tool.description,
    inputSchema: z.toJSONSchema(tool.input),
    outputSchema: z.toJSONSchema(tool.output),
    annotations: {
      readOnlyHint: tool.operation === "query",
      destructiveHint: tool.operation === "mutation",
    },
  }),
);

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseToolInput(
  operation: ToolOperation,
  name: string,
  input: unknown,
): { tool: PublicTool; input: Record<string, unknown> } {
  const tool = Object.hasOwn(tools, name)
    ? toolRegistry[name]
    : undefined;
  if (!tool || tool.operation !== operation) {
    throw new Error(`Unknown ${operation} tool: ${name}`);
  }
  const parsed = tool.input.parse(input);
  if (!record(parsed)) throw new Error(`Invalid ${operation} input: ${name}`);
  return { tool, input: parsed };
}

export function parseToolOutput(tool: PublicTool, output: unknown): unknown {
  return tool.output.parse(output);
}

export async function executePublicTool(
  operation: ToolOperation,
  name: string,
  input: unknown,
  context: ToolExecutionContext,
): Promise<unknown> {
  const parsed = parseToolInput(operation, name, input);
  return parseToolOutput(
    parsed.tool,
    await parsed.tool.execute(parsed.input, context),
  );
}

/** Backward-compatible query helper consumed by the static renderer. */
export function executeQuery(
  name: string,
  input: Record<string, unknown>,
  signal: AbortSignal = new AbortController().signal,
): Promise<unknown> {
  return executePublicTool("query", name, input, { signal });
}
