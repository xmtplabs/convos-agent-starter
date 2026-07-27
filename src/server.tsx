import {
  createParser,
  evaluate,
  evaluateElementProps,
  jsonToOpenUI,
  type ASTNode,
  type EvaluationContext,
  type OpenUIError,
  type ParseResult,
  type QueryStatementInfo,
} from "@openuidev/lang-core";
import { Renderer } from "@openuidev/react-lang";
import { renderToStaticMarkup } from "react-dom/server";
import { fixtureTools } from "./fixtures.js";
import { library } from "./library.js";
import {
  executeQuery,
  parseToolInput,
  parseToolOutput,
  toolRegistry,
  type PublicTool,
} from "./tools.js";

export const RENDER_LIMITS = Object.freeze({
  sourceBytes: 256 * 1024,
  queryCount: 16,
  queryConcurrency: 4,
  queryResultBytes: 256 * 1024,
  totalQueryBytes: 1024 * 1024,
  deadlineMs: 10_000,
  htmlBytes: 2 * 1024 * 1024,
  toolRequestBytes: 256 * 1024,
});

export type StaticRenderMode = "live" | "defaults";
export type RenderPhase =
  | "request"
  | "parse"
  | "query"
  | "mutation"
  | "evaluation"
  | "render"
  | "limit";

export type StaticRenderQuery = (
  name: string,
  args: Record<string, unknown>,
  context: { signal: AbortSignal },
) => Promise<unknown>;

export type StaticRenderOptions = {
  source: string;
  queryMode?: StaticRenderMode;
  query?: StaticRenderQuery;
  mountPath: string;
  stylesheetPath: string;
  signal?: AbortSignal;
  deadlineMs?: number;
  now?: () => number;
  telemetry?: StaticRenderTelemetry;
};

export type StaticRenderTelemetry = {
  queryCount: number;
  queryDurationMs: number;
};

export type StaticRenderResult = {
  html: string;
  queryCount: number;
  queryDurationMs: number;
};

export type OpenUiErrorCode =
  | "openui_invalid_request"
  | "openui_parse_failed"
  | "openui_unknown_tool"
  | "openui_query_invalid"
  | "openui_query_failed"
  | "openui_query_cycle"
  | "openui_mutation_invalid"
  | "openui_evaluation_failed"
  | "openui_render_failed"
  | "openui_limit_exceeded"
  | "openui_deadline_exceeded";

export class OpenUiRenderError extends Error {
  constructor(
    readonly code: OpenUiErrorCode,
    readonly phase: RenderPhase,
    message: string,
    readonly status = 422,
    readonly statement?: string,
    readonly tool?: string,
  ) {
    super(message);
  }
}

const encoder = new TextEncoder();
const own = (value: object, key: PropertyKey) => Object.hasOwn(value, key);
const emptyRecord = <T,>(): Record<string, T> =>
  Object.create(null) as Record<string, T>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sourceBytes(value: string): number {
  return encoder.encode(value).byteLength;
}

function checkSourceLimit(source: string): void {
  if (sourceBytes(source) > RENDER_LIMITS.sourceBytes) {
    throw new OpenUiRenderError(
      "openui_limit_exceeded",
      "limit",
      "The OpenUI document exceeds the source limit.",
      413,
    );
  }
}

function strictParse(source: string): ParseResult {
  checkSourceLimit(source);
  let parsed: ParseResult;
  try {
    parsed = createParser(library.toJSONSchema(), library.root).parse(source);
  } catch {
    throw new OpenUiRenderError(
      "openui_parse_failed",
      "parse",
      "The OpenUI document could not be parsed.",
    );
  }
  if (
    !parsed.root ||
    parsed.root.statementId !== "root" ||
    parsed.root.typeName !== library.root ||
    parsed.meta.incomplete ||
    parsed.meta.errors.length > 0 ||
    parsed.meta.unresolved.length > 0 ||
    parsed.meta.orphaned.length > 0
  ) {
    throw new OpenUiRenderError(
      "openui_parse_failed",
      "parse",
      "The OpenUI document must be complete and declare an explicit root.",
    );
  }
  if (parsed.queryStatements.length > RENDER_LIMITS.queryCount) {
    throw new OpenUiRenderError(
      "openui_limit_exceeded",
      "limit",
      "The OpenUI document contains too many Queries.",
      413,
    );
  }
  return parsed;
}

function evaluationContext(
  parsed: ParseResult,
  values: Record<string, unknown>,
): EvaluationContext {
  return {
    getState: (name) =>
      own(parsed.stateDeclarations, name)
        ? parsed.stateDeclarations[name]
        : undefined,
    resolveRef: (name) => (own(values, name) ? values[name] : undefined),
  };
}

function references(node: ASTNode | null): string[] {
  if (!node) return [];
  switch (node.k) {
    case "Ref":
    case "RuntimeRef":
      return [node.n];
    case "Comp":
      return [...node.args, ...Object.values(node.mappedProps ?? {})].flatMap(
        references,
      );
    case "Arr":
      return node.els.flatMap(references);
    case "Obj":
      return node.entries.flatMap(([, value]) => references(value));
    case "BinOp":
      return [...references(node.left), ...references(node.right)];
    case "UnaryOp":
      return references(node.operand);
    case "Ternary":
      return [
        ...references(node.cond),
        ...references(node.then),
        ...references(node.else),
      ];
    case "Member":
      return references(node.obj);
    case "Index":
      return [...references(node.obj), ...references(node.index)];
    case "Assign":
      return references(node.value);
    default:
      return [];
  }
}

function queryDependencies(
  statement: QueryStatementInfo,
  queryIds: Set<string>,
): Set<string> {
  return new Set(
    [
      ...references(statement.toolAST),
      ...references(statement.argsAST),
      ...references(statement.defaultsAST),
    ].filter((reference) => queryIds.has(reference)),
  );
}

function evaluateQueryPart(
  node: ASTNode | null,
  parsed: ParseResult,
  values: Record<string, unknown>,
  statement: string,
  label: string,
): unknown {
  if (!node) return undefined;
  try {
    return evaluate(node, evaluationContext(parsed, values));
  } catch {
    throw new OpenUiRenderError(
      "openui_query_invalid",
      "query",
      `The Query ${label} could not be evaluated.`,
      422,
      statement,
    );
  }
}

function queryTool(
  name: unknown,
  args: unknown,
  statement: string,
): { name: string; tool: PublicTool; args: Record<string, unknown> } {
  if (typeof name !== "string" || !own(toolRegistry, name)) {
    throw new OpenUiRenderError(
      "openui_unknown_tool",
      "query",
      "A Query names an unknown public tool.",
      422,
      statement,
      typeof name === "string" ? name : undefined,
    );
  }
  try {
    const parsed = parseToolInput("query", name, args ?? {});
    return { name, tool: parsed.tool, args: parsed.input };
  } catch {
    throw new OpenUiRenderError(
      toolRegistry[name]?.operation === "mutation"
        ? "openui_unknown_tool"
        : "openui_query_invalid",
      "query",
      "A Query has invalid tool arguments.",
      422,
      statement,
      name,
    );
  }
}

function encodedResultBytes(value: unknown, statement: string): number {
  let json: string | undefined;
  try {
    json = JSON.stringify(value);
  } catch {
    json = undefined;
  }
  if (json === undefined) {
    throw new OpenUiRenderError(
      "openui_query_failed",
      "query",
      "A Query returned a value that cannot be serialized.",
      422,
      statement,
    );
  }
  const bytes = sourceBytes(json);
  if (bytes > RENDER_LIMITS.queryResultBytes) {
    throw new OpenUiRenderError(
      "openui_limit_exceeded",
      "limit",
      "A Query result exceeds the per-result limit.",
      413,
      statement,
    );
  }
  return bytes;
}

async function resolveOneQuery(
  statement: QueryStatementInfo,
  parsed: ParseResult,
  values: Record<string, unknown>,
  queryMode: StaticRenderMode,
  query: StaticRenderQuery,
  runtime: RenderRuntime,
): Promise<{ id: string; value: unknown; bytes: number }> {
  if (!statement.complete || !statement.toolAST) {
    throw new OpenUiRenderError(
      "openui_parse_failed",
      "parse",
      "The OpenUI document contains an incomplete Query.",
      422,
      statement.statementId,
    );
  }
  const name = evaluateQueryPart(
    statement.toolAST,
    parsed,
    values,
    statement.statementId,
    "tool name",
  );
  const args = evaluateQueryPart(
    statement.argsAST,
    parsed,
    values,
    statement.statementId,
    "arguments",
  );
  const defaults = evaluateQueryPart(
    statement.defaultsAST,
    parsed,
    values,
    statement.statementId,
    "defaults",
  );
  const selected = queryTool(name, args, statement.statementId);
  let value: unknown;
  if (queryMode === "defaults") {
    try {
      value = parseToolOutput(selected.tool, defaults ?? null);
    } catch {
      throw new OpenUiRenderError(
        "openui_query_invalid",
        "query",
        "A Query has defaults that do not match its output schema.",
        422,
        statement.statementId,
        selected.name,
      );
    }
  } else {
    try {
      runtime.assertDeadline(statement.statementId, selected.name);
      const work = Promise.resolve()
        .then(() =>
          query(selected.name, selected.args, { signal: runtime.signal }),
        )
        .then((output) => parseToolOutput(selected.tool, output));
      value = await raceWithDeadline(
        work,
        runtime,
        statement.statementId,
        selected.name,
      );
    } catch (error) {
      if (error instanceof OpenUiRenderError) throw error;
      if (runtime.signal.aborted) {
        throw new OpenUiRenderError(
          "openui_deadline_exceeded",
          "limit",
          "The static render deadline was exceeded.",
          504,
          statement.statementId,
          selected.name,
        );
      }
      throw new OpenUiRenderError(
        "openui_query_failed",
        "query",
        "A public page Query failed.",
        422,
        statement.statementId,
        selected.name,
      );
    }
  }
  return {
    id: statement.statementId,
    value,
    bytes: encodedResultBytes(value, statement.statementId),
  };
}

async function resolveQueries(
  parsed: ParseResult,
  queryMode: StaticRenderMode,
  query: StaticRenderQuery,
  runtime: RenderRuntime,
): Promise<Record<string, unknown>> {
  const values = emptyRecord<unknown>();
  const pending = new Map(
    parsed.queryStatements.map((statement) => [
      statement.statementId,
      statement,
    ]),
  );
  if (pending.size !== parsed.queryStatements.length) {
    throw new OpenUiRenderError(
      "openui_parse_failed",
      "parse",
      "Query statement identifiers must be unique.",
    );
  }
  const queryIds = new Set(pending.keys());
  const dependencies = new Map(
    [...pending.values()].map((statement) => [
      statement.statementId,
      queryDependencies(statement, queryIds),
    ]),
  );
  let totalBytes = 0;
  while (pending.size > 0) {
    runtime.assertDeadline();
    const ready = [...pending.values()].filter((statement) =>
      [...(dependencies.get(statement.statementId) ?? [])].every((dependency) =>
        own(values, dependency),
      ),
    );
    if (ready.length === 0) {
      throw new OpenUiRenderError(
        "openui_query_cycle",
        "query",
        "The OpenUI document contains a Query dependency cycle.",
      );
    }
    for (
      let offset = 0;
      offset < ready.length;
      offset += RENDER_LIMITS.queryConcurrency
    ) {
      const batch = ready.slice(
        offset,
        offset + RENDER_LIMITS.queryConcurrency,
      );
      const batchWork = Promise.all(
        batch.map((statement) =>
          resolveOneQuery(
            statement,
            parsed,
            values,
            queryMode,
            query,
            runtime,
          ),
        ),
      );
      const results = await raceWithDeadline(
        batchWork,
        runtime,
      );
      runtime.assertDeadline();
      for (const result of results) {
        totalBytes += result.bytes;
        if (totalBytes > RENDER_LIMITS.totalQueryBytes) {
          throw new OpenUiRenderError(
            "openui_limit_exceeded",
            "limit",
            "Query results exceed the aggregate data limit.",
            413,
            result.id,
          );
        }
        values[result.id] = result.value;
        pending.delete(result.id);
      }
    }
  }
  return values;
}

function validateMutations(
  parsed: ParseResult,
  values: Record<string, unknown>,
): void {
  for (const statement of parsed.mutationStatements) {
    let name: unknown;
    let args: unknown;
    try {
      const context = evaluationContext(parsed, values);
      name = statement.toolAST ? evaluate(statement.toolAST, context) : null;
      args = statement.argsAST ? evaluate(statement.argsAST, context) : {};
    } catch {
      throw new OpenUiRenderError(
        "openui_mutation_invalid",
        "mutation",
        "A Mutation expression could not be evaluated.",
        422,
        statement.statementId,
      );
    }
    if (typeof name !== "string" || !own(toolRegistry, name)) {
      throw new OpenUiRenderError(
        "openui_unknown_tool",
        "mutation",
        "A Mutation names an unknown public tool.",
        422,
        statement.statementId,
        typeof name === "string" ? name : undefined,
      );
    }
    try {
      parseToolInput("mutation", name, args);
    } catch {
      throw new OpenUiRenderError(
        "openui_mutation_invalid",
        "mutation",
        "A Mutation has invalid or non-idempotent arguments.",
        422,
        statement.statementId,
        name,
      );
    }
  }
}

function validateMountPath(value: string): void {
  if (
    !value.startsWith("/") ||
    (value !== "/" && value.endsWith("/")) ||
    value.includes("\\") ||
    value.includes("?") ||
    value.includes("#") ||
    value.includes("//") ||
    value.split("/").some((part) => part === "." || part === "..")
  ) {
    throw new OpenUiRenderError(
      "openui_invalid_request",
      "request",
      "The static render mount path is invalid.",
      400,
    );
  }
}

function validateStylesheetPath(value: string): void {
  if (
    !value ||
    value.includes("\\") ||
    value.includes("?") ||
    value.includes("#") ||
    value.includes("//") ||
    /^[a-z][a-z0-9+.-]*:/i.test(value) ||
    value.split("/").some((part) => part === "." || part === "..")
  ) {
    throw new OpenUiRenderError(
      "openui_invalid_request",
      "request",
      "The static render stylesheet path is invalid.",
      400,
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

type RenderRuntime = {
  signal: AbortSignal;
  deadlineAt: number;
  now: () => number;
  abort: () => void;
  assertDeadline: (statement?: string, tool?: string) => void;
  cleanup: () => void;
};

function deadlineError(statement?: string, tool?: string): OpenUiRenderError {
  return new OpenUiRenderError(
    "openui_deadline_exceeded",
    "limit",
    "The static render deadline was exceeded.",
    504,
    statement,
    tool,
  );
}

function createRenderRuntime(
  parent: AbortSignal | undefined,
  deadlineMs: number,
  now: () => number,
): RenderRuntime {
  const controller = new AbortController();
  const abortFromParent = () =>
    controller.abort(parent?.reason ?? new Error("render cancelled"));
  if (parent?.aborted) abortFromParent();
  else parent?.addEventListener("abort", abortFromParent, { once: true });
  const duration = Math.min(
    Math.max(1, deadlineMs),
    RENDER_LIMITS.deadlineMs,
  );
  const deadlineAt = now() + duration;
  const abort = () =>
    controller.abort(new Error("render deadline exceeded"));
  const assertDeadline = (statement?: string, tool?: string) => {
    if (controller.signal.aborted || now() >= deadlineAt) {
      abort();
      throw deadlineError(statement, tool);
    }
  };
  const timeout = setTimeout(
    abort,
    Math.max(0, deadlineAt - now()),
  );
  return {
    signal: controller.signal,
    deadlineAt,
    now,
    abort,
    assertDeadline,
    cleanup: () => {
      clearTimeout(timeout);
      parent?.removeEventListener("abort", abortFromParent);
    },
  };
}

function raceWithDeadline<T>(
  work: Promise<T>,
  runtime: RenderRuntime,
  statement?: string,
  tool?: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      runtime.signal.removeEventListener("abort", aborted);
      callback();
    };
    const aborted = () =>
      finish(() => reject(deadlineError(statement, tool)));
    runtime.signal.addEventListener("abort", aborted, { once: true });
    work.then(
      (value) =>
        finish(() => {
          if (
            runtime.signal.aborted ||
            runtime.now() >= runtime.deadlineAt
          ) {
            runtime.abort();
            reject(deadlineError(statement, tool));
            return;
          }
          resolve(value);
        }),
      (error: unknown) =>
        finish(() => {
          if (
            runtime.signal.aborted ||
            runtime.now() >= runtime.deadlineAt
          ) {
            runtime.abort();
            reject(deadlineError(statement, tool));
            return;
          }
          reject(error);
        }),
    );
    try {
      runtime.assertDeadline(statement, tool);
    } catch (error) {
      finish(() => reject(error));
    }
  });
}

function evaluateRoot(
  parsed: ParseResult,
  queryValues: Record<string, unknown>,
) {
  const errors: OpenUIError[] = [];
  let evaluated;
  try {
    evaluated = evaluateElementProps(parsed.root!, {
      ctx: evaluationContext(parsed, queryValues),
      library,
      store: null,
      errors,
    });
  } catch {
    throw new OpenUiRenderError(
      "openui_evaluation_failed",
      "evaluation",
      "The OpenUI root could not be evaluated.",
    );
  }
  if (errors.length > 0) {
    throw new OpenUiRenderError(
      "openui_evaluation_failed",
      "evaluation",
      "The OpenUI root contains runtime evaluation errors.",
      422,
      errors[0]?.statementId,
      errors[0]?.toolName,
    );
  }
  return evaluated;
}

function staticDocument(
  markup: string,
  title: string,
  mountPath: string,
  stylesheetPath: string,
): string {
  validateMountPath(mountPath);
  validateStylesheetPath(stylesheetPath);
  const base = mountPath === "/" ? "/" : `${mountPath}/`;
  const stylesheet = stylesheetPath.startsWith("/")
    ? stylesheetPath.slice(1)
    : stylesheetPath;
  return (
    "<!doctype html>" +
    '<html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    `<base href="${escapeHtml(base)}">` +
    `<link rel="stylesheet" href="${escapeHtml(stylesheet)}">` +
    `<title>${escapeHtml(title)}</title>` +
    `</head><body>${markup}</body></html>`
  );
}

/**
 * Strictly parses, validates, resolves, and statically renders one OpenUI
 * document. Mutation statements are schema-checked but are never executed.
 */
export async function renderOpenUiDocument({
  source,
  queryMode = "live",
  query = (name, args, context) => executeQuery(name, args, context.signal),
  mountPath,
  stylesheetPath,
  signal: parentSignal,
  deadlineMs = RENDER_LIMITS.deadlineMs,
  now = Date.now,
  telemetry,
}: StaticRenderOptions): Promise<StaticRenderResult> {
  const runtime = createRenderRuntime(parentSignal, deadlineMs, now);
  try {
    const parsed = strictParse(source);
    if (telemetry !== undefined) {
      telemetry.queryCount = parsed.queryStatements.length;
    }
    runtime.assertDeadline();
    const queryStartedAt = Date.now();
    let queryValues = emptyRecord<unknown>();
    try {
      queryValues = await resolveQueries(
        parsed,
        queryMode,
        query,
        runtime,
      );
    } finally {
      if (telemetry !== undefined) {
        telemetry.queryDurationMs = Math.max(0, Date.now() - queryStartedAt);
      }
    }
    const queryDurationMs =
      telemetry?.queryDurationMs ??
      Math.max(0, Date.now() - queryStartedAt);
    runtime.assertDeadline();
    validateMutations(parsed, queryValues);
    const evaluated = evaluateRoot(parsed, queryValues);
    runtime.assertDeadline();
    let serializedSource: string;
    let markup: string;
    try {
      serializedSource = jsonToOpenUI(evaluated, library, {
        stateDeclarations: parsed.stateDeclarations,
      });
      runtime.assertDeadline();
      markup = renderToStaticMarkup(
        <Renderer
          response={serializedSource}
          library={library}
          isStreaming={false}
        />,
      );
      runtime.assertDeadline();
    } catch (error) {
      if (error instanceof OpenUiRenderError) throw error;
      throw new OpenUiRenderError(
        "openui_render_failed",
        "render",
        "The OpenUI page could not be rendered.",
      );
    }
    if (!markup || (markup.match(/<h1(?:\s|>)/g) ?? []).length !== 1) {
      throw new OpenUiRenderError(
        "openui_render_failed",
        "render",
        "A static page must render exactly one level-one heading.",
      );
    }
    const title =
      typeof evaluated.props.title === "string"
        ? evaluated.props.title
        : "Convos site";
    const html = staticDocument(
      markup,
      title,
      mountPath,
      stylesheetPath,
    );
    runtime.assertDeadline();
    if (sourceBytes(html) > RENDER_LIMITS.htmlBytes) {
      throw new OpenUiRenderError(
        "openui_limit_exceeded",
        "limit",
        "The rendered HTML exceeds the output limit.",
        413,
      );
    }
    runtime.assertDeadline();
    return {
      html,
      queryCount: parsed.queryStatements.length,
      queryDurationMs,
    };
  } catch (error) {
    runtime.abort();
    throw error;
  } finally {
    runtime.cleanup();
  }
}

/** Deterministic fixture renderer consumed by T007's local render command. */
export function renderFixtureOpenUiDocument(
  source: string,
  queryMode: StaticRenderMode = "live",
): Promise<StaticRenderResult> {
  return renderOpenUiDocument({
    source,
    queryMode,
    mountPath: "/",
    stylesheetPath: "src/styles.css",
    query: async (name, args, { signal }) => {
      const fixture = own(fixtureTools, name) ? fixtureTools[name] : undefined;
      if (!fixture || fixture.operation !== "query") {
        throw new Error(`Unknown fixture query: ${name}`);
      }
      return fixture.execute(args, signal);
    },
  });
}

function problemTitle(code: OpenUiErrorCode): string {
  const titles: Record<OpenUiErrorCode, string> = {
    openui_invalid_request: "Invalid OpenUI request",
    openui_parse_failed: "OpenUI parse failed",
    openui_unknown_tool: "Unknown OpenUI tool",
    openui_query_invalid: "OpenUI query is invalid",
    openui_query_failed: "OpenUI query failed",
    openui_query_cycle: "OpenUI query dependency cycle",
    openui_mutation_invalid: "OpenUI mutation is invalid",
    openui_evaluation_failed: "OpenUI evaluation failed",
    openui_render_failed: "OpenUI render failed",
    openui_limit_exceeded: "OpenUI render limit exceeded",
    openui_deadline_exceeded: "OpenUI render deadline exceeded",
  };
  return titles[code];
}

export function problemResponse(error: unknown): Response {
  const safe =
    error instanceof OpenUiRenderError
      ? error
      : new OpenUiRenderError(
          "openui_render_failed",
          "render",
          "The OpenUI request failed.",
        );
  return Response.json(
    {
      type: `https://convos.org/problems/${safe.code.replaceAll("_", "-")}`,
      title: problemTitle(safe.code),
      status: safe.status,
      code: safe.code,
      phase: safe.phase,
      ...(safe.statement ? { statement: safe.statement } : {}),
      ...(safe.tool ? { tool: safe.tool } : {}),
    },
    {
      status: safe.status,
      headers: {
        "content-type": "application/problem+json; charset=utf-8",
        "cache-control": "no-store",
      },
    },
  );
}

async function boundedText(request: Request, limit: number): Promise<string> {
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > limit)) {
    throw new OpenUiRenderError(
      "openui_limit_exceeded",
      "limit",
      "The request body exceeds the allowed size.",
      413,
    );
  }
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel("OpenUI request body exceeds the limit");
        throw new OpenUiRenderError(
          "openui_limit_exceeded",
          "limit",
          "The request body exceeds the allowed size.",
          413,
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return new TextDecoder("utf-8", {
      fatal: true,
      ignoreBOM: false,
    }).decode(body);
  } catch {
    throw requestError("The request body is not valid UTF-8.");
  }
}

function requestError(message: string, status = 400): OpenUiRenderError {
  return new OpenUiRenderError(
    "openui_invalid_request",
    "request",
    message,
    status,
  );
}

async function handleToolRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") throw requestError("Method not allowed.", 405);
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    throw requestError("Tool requests require application/json.", 415);
  }
  let body: unknown;
  try {
    body = JSON.parse(
      await boundedText(request, RENDER_LIMITS.toolRequestBytes),
    );
  } catch (error) {
    if (error instanceof OpenUiRenderError) throw error;
    throw requestError("The tool request is not valid JSON.");
  }
  if (
    !isRecord(body) ||
    Object.keys(body).length !== 2 ||
    !own(body, "name") ||
    !own(body, "arguments") ||
    typeof body.name !== "string" ||
    !isRecord(body.arguments)
  ) {
    throw requestError(
      'Tool requests must be exactly {"name":string,"arguments":object}.',
    );
  }
  const tool = own(toolRegistry, body.name)
    ? toolRegistry[body.name]
    : undefined;
  if (!tool) {
    throw new OpenUiRenderError(
      "openui_unknown_tool",
      "request",
      "The requested public tool does not exist.",
      404,
      undefined,
      body.name,
    );
  }
  let parsed: { tool: PublicTool; input: Record<string, unknown> };
  try {
    parsed = parseToolInput(tool.operation, body.name, body.arguments);
  } catch {
    throw requestError("The tool arguments are invalid.", 422);
  }
  let output: unknown;
  try {
    output = parseToolOutput(
      parsed.tool,
      await parsed.tool.execute(parsed.input, { signal: request.signal }),
    );
  } catch {
    throw new OpenUiRenderError(
      tool.operation === "mutation"
        ? "openui_mutation_invalid"
        : "openui_query_failed",
      tool.operation,
      "The public tool failed.",
      422,
      undefined,
      body.name,
    );
  }
  return Response.json(output, {
    headers: { "cache-control": "no-store" },
  });
}

async function handleStaticRenderRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") throw requestError("Method not allowed.", 405);
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("text/plain")
  ) {
    throw requestError("Static rendering requires text/plain.", 415);
  }
  const mode = new URL(request.url).searchParams.get("query_mode");
  if (mode !== "live" && mode !== "defaults") {
    throw requestError("query_mode must be live or defaults.");
  }
  const mountPath = request.headers.get(SITE_BASE_PATH_HEADER);
  const stylesheetPath = request.headers.get(SITE_STYLESHEET_HEADER);
  if (!mountPath || !stylesheetPath) {
    throw requestError(
      "Static rendering requires explicit mount and stylesheet metadata.",
    );
  }
  const deadlineAt = Date.now() + renderDeadlineMs(request);
  const source = await boundedText(request, RENDER_LIMITS.sourceBytes);
  const remaining = deadlineAt - Date.now();
  if (remaining <= 0) throw deadlineError();
  const telemetry: StaticRenderTelemetry = {
    queryCount: 0,
    queryDurationMs: 0,
  };
  try {
    const result = await renderOpenUiDocument({
      source,
      queryMode: mode,
      mountPath,
      stylesheetPath,
      signal: request.signal,
      deadlineMs: remaining,
      telemetry,
    });
    return new Response(result.html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
        [SITE_QUERY_COUNT_HEADER]: String(result.queryCount),
        [SITE_QUERY_DURATION_HEADER]: String(result.queryDurationMs),
      },
    });
  } catch (error) {
    const problem = problemResponse(error);
    const headers = new Headers(problem.headers);
    headers.set(SITE_QUERY_COUNT_HEADER, String(telemetry.queryCount));
    headers.set(
      SITE_QUERY_DURATION_HEADER,
      String(telemetry.queryDurationMs),
    );
    return new Response(problem.body, {
      status: problem.status,
      statusText: problem.statusText,
      headers,
    });
  }
}

export const SITE_BASE_PATH_HEADER = "x-convos-site-base-path";
export const SITE_STYLESHEET_HEADER = "x-convos-site-stylesheet";
export const SITE_RENDER_TIMEOUT_HEADER = "x-convos-render-timeout-ms";
export const SITE_QUERY_COUNT_HEADER = "x-convos-openui-query-count";
export const SITE_QUERY_DURATION_HEADER =
  "x-convos-openui-query-duration-ms";

function renderDeadlineMs(request: Request): number {
  const value = request.headers.get(SITE_RENDER_TIMEOUT_HEADER);
  if (value === null) return RENDER_LIMITS.deadlineMs;
  if (!/^[1-9]\d{0,4}$/.test(value)) {
    throw requestError("The trusted render deadline is invalid.");
  }
  const milliseconds = Number(value);
  if (
    !Number.isSafeInteger(milliseconds) ||
    milliseconds > RENDER_LIMITS.deadlineMs
  ) {
    throw requestError("The trusted render deadline is invalid.");
  }
  return milliseconds;
}

function logicalRuntimePath(request: Request): string {
  const mountPath = request.headers.get(SITE_BASE_PATH_HEADER);
  if (!mountPath) throw requestError("Missing trusted site mount metadata.");
  validateMountPath(mountPath);
  const pathname = new URL(request.url).pathname;
  const prefix = mountPath === "/" ? "" : mountPath;
  if (!pathname.startsWith(`${prefix}/`)) return "";
  return pathname.slice(prefix.length);
}

async function fetch(request: Request): Promise<Response> {
  try {
    const pathname = logicalRuntimePath(request);
    if (pathname === "/__convos/tools") {
      return await handleToolRequest(request);
    }
    if (pathname === "/__convos/render") {
      return await handleStaticRenderRequest(request);
    }
    return problemResponse(requestError("Reserved runtime route not found.", 404));
  } catch (error) {
    return problemResponse(error);
  }
}

export default { fetch };
