import { createSiteLibrary } from "./library.js";
import { toolDescriptors } from "./tools.js";

export const OPENUI_CATALOG_RULES = [
  "Edit pages/**/*.openui for page-content and layout changes.",
  "Read this complete component and tool catalog before editing.",
  "Reuse an existing component whenever it can express the requested result.",
  "Modify src only when no existing component or tool is a good fit.",
  "After modifying src, regenerate this prompt and run the full deployment checks.",
  "Do not invent components or tool names absent from this catalog.",
  "Queries may call only listed read-only tools.",
  "Mutations may call only listed mutation tools and must run from an explicit visitor-activated Button action.",
  "Every mutation invocation must supply its required idempotency key.",
] as const;

/** Plain, inert data consumed by AgentServer before it invokes candidate code. */
export function createOpenUiCatalog() {
  return {
    schemaVersion: 1,
    library: createSiteLibrary().toSpec(),
    tools: toolDescriptors.map((tool) => ({
      name: tool.name,
      ...(tool.description === undefined ? {} : { description: tool.description }),
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema,
      ...(tool.annotations === undefined ? {} : { annotations: tool.annotations }),
    })),
    rules: [...OPENUI_CATALOG_RULES],
  };
}

/** The committed artifact is strict JSON, never a runtime module. */
export function serializeOpenUiCatalog(): string {
  return `${JSON.stringify(createOpenUiCatalog(), null, 2)}\n`;
}
