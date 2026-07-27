import { generateSystemPrompt } from "@openuidev/lang-core";
import { createOpenUiCatalog, OPENUI_CATALOG_RULES } from "./catalog.js";

const rules = [...OPENUI_CATALOG_RULES];

function compareCodePoints(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort(compareCodePoints)
        .map((key) => [key, canonicalize(record[key])]),
    );
  }
  return value;
}

/**
 * Produces the committed authoring contract from the exact runtime component
 * library and public-tool registry.
 */
export function createOpenUiSystemPrompt(): string {
  const catalog = createOpenUiCatalog();
  const componentPrompt = generateSystemPrompt({
    library: catalog.library,
    promptOptions: {
      toolCalls: false,
      bindings: false,
      additionalRules: rules,
    },
  });
  const tools = catalog.tools
    .slice()
    .sort((left, right) => compareCodePoints(left.name, right.name))
    .map((tool) => {
      const operation = tool.annotations?.readOnlyHint ? "Query" : "Mutation";
      return (
        `### ${tool.name} (${operation})\n\n${tool.description ?? `Public ${operation} tool.`}\n\n` +
        `Input schema: ${canonicalJson(tool.inputSchema)}\n\n` +
        `Output schema: ${canonicalJson(tool.outputSchema)}`
      );
    })
    .join("\n\n");
  return (
    `${componentPrompt}\n\n## Public tools\n\n` +
    "These are the only callable tools. For a listed Query tool, use " +
    "`name = Query(\"tool_name\", args, defaults)` with defaults matching its output schema. " +
    "For a listed Mutation tool, declare `name = Mutation(\"tool_name\", args)` and run it only " +
    "from an explicit visitor action such as " +
    "`Button(null, \"Send\", \"primary\", Action([@Run(name)]))`. " +
    "Static rendering validates Mutation declarations but never executes them.\n\n" +
    `${tools}\n`
  );
}
