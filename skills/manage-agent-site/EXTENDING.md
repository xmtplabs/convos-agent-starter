# Working with and extending the OpenUI agent site

This guide explains how to author pages, add components, and add public tools
to the OpenUI agent site starter.

The starter deliberately separates page data from executable code:

| Change | Files | Requires a new bundle? |
| --- | --- | --- |
| Copy, layout, or page composition | `pages/**/*.openui` | No |
| Static image or other public asset | `assets/**` | No |
| Component behavior or markup | `src/library.tsx`, usually `src/styles.css` | Yes |
| Public query or mutation | `src/tools.ts`, and usually `src/fixtures.ts` | Yes |
| Runtime behavior | `src/client.tsx`, `src/server.tsx` | Yes |
| Runtime dependency or entrypoint | `package.json`, `pnpm-lock.yaml` | Yes |

The manifest records separate aggregate identities for dependencies, bundled
code, and page/asset content. A page-only deployment can therefore reuse the
existing Worker bundle. The browser fetches the current OpenUI document from
the server and, for a normal pinned site URL, checks for a newer document every
five seconds.

## Start with the generated contract

Before editing a page, read
[`generated/openui-system-prompt.txt`](../../generated/openui-system-prompt.txt).
It is the exact, generated contract for:

- component names, descriptions, and positional argument order;
- allowed enum values and required properties;
- public query and mutation names;
- tool input and output schemas; and
- the platform's authoring and mutation-safety rules.

Do not hand-edit either file in `generated/`, and do not invent syntax that is
absent from the prompt. In particular, component arguments are positional, not
named.

Use `src/` only when the generated contract cannot express the requested
result. Most changes should stay in `pages/**/*.openui`.

## Author a page

Routes are derived from page paths:

| File | Route |
| --- | --- |
| `pages/index.openui` | `/` |
| `pages/about.openui` | `/about` |
| `pages/docs/index.openui` | `/docs` |

Routes are static and case-sensitive. Do not use dynamic segments, encoded
separators, dot segments, or backslashes.

Every page is a complete OpenUI Lang Text document. Put `root` first, make
`Page` the root component, and include exactly one level-one `Heading`.
References may point forward to declarations later in the document:

```openui
root = Page("Group status", [Section(null, "plain", hero), Section("Details", "muted", details)])
hero = Stack("lg", [Badge("Active", "success"), Heading("Group status", 1), Text("Everything is running normally.", "muted")])
details = Grid(2, [Card("Members", [Text("Four people are participating.")]), Card("Next step", [Button("/about", "Read more", "secondary")])])
```

Every declaration other than `root` must be reachable from `root`.
Slash-prefixed local links and asset paths are rewritten so they remain inside
the mounted site:

```openui
root = Page("Project", [Section(null, "plain", [Heading("Project", 1), Image("/project-map.png", "Map of the project area"), Link("/about", "About this project")])])
```

Store the image as `assets/project-map.png`.

Render a route or page file without opening a browser:

```sh
pnpm --silent render -- /
pnpm --silent render -- pages/about.openui
```

Success writes one complete HTML document to stdout. Failure writes stable JSON
to stderr and exits nonzero. The renderer parses the OpenUI document, executes
queries against deterministic fixtures, validates mutation declarations
without executing them, renders React to static HTML, and checks output and
structural validation limits.

## Use an existing query

A query has a public tool name, an argument object, and a default result. The
default must satisfy the tool's output schema. It is used for deterministic
validation and as the initial result before live data is available.

This example uses the existing `get_group` query:

```openui
root = Page("Group", [Section(null, "plain", [Heading(group.name, 1), Text("This heading comes from the live public group record.", "muted")])])
group = Query("get_group", {}, {conversation_id: "loading", created_at: "2026-07-24T00:00:00.000Z", is_active: true, kind: "group", member_count: 0, name: "Loading group…"})
```

Queries execute client-side during ordinary page rendering. Static validation
may prefetch them so it can prove the page renders without an error.

## Add a component

Components live in `src/library.tsx`. Each component has:

1. a Zod props schema;
2. an exact OpenUI name and useful authoring description;
3. an SSR-safe React renderer; and
4. an entry in the `components` array.

For example, add a compact status panel:

```tsx
const statusPanelSchema = z.object({
  label: z.string(),
  tone: z.enum(["neutral", "success", "warning", "danger"]).default("neutral"),
  detail: z.string().optional(),
});

const StatusPanel = defineComponent({
  name: "StatusPanel",
  description:
    "A prominent operational status with an optional supporting detail.",
  props: statusPanelSchema,
  component: ({
    props,
  }: ComponentRenderProps<z.infer<typeof statusPanelSchema>>) => (
    <aside
      className={`status-panel status-panel--${props.tone}`}
      role={props.tone === "danger" ? "alert" : "status"}
    >
      <strong>{props.label}</strong>
      {props.detail ? <p>{props.detail}</p> : null}
    </aside>
  ),
});
```

Add it to the component inventory:

```tsx
const components = [
  Page,
  Section,
  // ...
  ErrorState,
  StatusPanel,
];
```

Add its styles to `src/styles.css`:

```css
.status-panel {
  border: 1px solid currentColor;
  border-radius: 0.75rem;
  padding: 1rem;
}

.status-panel--success {
  color: #166534;
  background: #f0fdf4;
}

.status-panel--warning {
  color: #854d0e;
  background: #fefce8;
}

.status-panel--danger {
  color: #991b1b;
  background: #fef2f2;
}
```

The Zod property order determines the generated positional signature:

```openui
StatusPanel("All systems operational", "success", "Updated moments ago")
```

Component requirements:

- Rendering must be deterministic and safe in both the browser and
  `react-dom/server`. Do not read `window`, `document`, `localStorage`, layout,
  or the current time during render.
- Use semantic HTML, accessible names, and appropriate live-region behavior.
- Validate every authored prop with Zod. Prefer bounded enums to free-form
  styling switches.
- Call `renderNode(props.children)` for component-authored child nodes. Do not
  render the raw OpenUI AST directly.
- Use `toMountUrl` for site-local links or resources.
- Reuse `useTriggerAction` for an OpenUI `Action`; do not create a second,
  unvalidated mutation path.
- Avoid adding a dependency when a small React component is sufficient. If a
  dependency is necessary, exact-pin it and update `pnpm-lock.yaml`.

You normally do not edit `src/catalog.ts`. It derives the inert catalog from
the library and tool registry automatically.

## Add a public query tool

Tools live in `src/tools.ts`. The public registry is the sole browser-facing
tool boundary. Every registered tool is callable without authentication, so it
must expose only public, visitor-safe behavior. The OpenUI action rules govern
authored pages; they are not an access-control boundary for the public tool
endpoint.

First define a reusable output schema:

```ts
const publicStatus = z.object({
  label: z.string(),
  tone: z.enum(["neutral", "success", "warning", "danger"]),
  detail: z.string(),
});
```

Then add the tool to `tools`:

```ts
get_public_status: {
  operation: "query",
  description: "Get the current public operational status for this group.",
  input: z.object({}),
  output: publicStatus,
  async execute(
    _input: Record<string, unknown>,
    { signal }: ToolExecutionContext,
  ) {
    const response = await fetch(
      "https://artifacts.internal/v1/group/public-status",
      { signal },
    );
    if (!response.ok) throw new Error("The public status is unavailable.");
    return response.json();
  },
},
```

The runtime validates input before `execute` and validates the returned value
against `output` afterward. Always pass the supplied `AbortSignal` to outbound
work so render and request deadlines can cancel it.

Add a deterministic query fixture to `src/fixtures.ts`. Local rendering and
homepage validation must not depend on a live service:

```ts
get_public_status: {
  operation: "query",
  async execute(_input, _signal) {
    return {
      label: "All systems operational",
      tone: "success",
      detail: "Fixture data for local validation.",
    };
  },
},
```

The new query can feed existing components or the custom `StatusPanel`:

```openui
root = Page("Status", [Section(null, "plain", [Heading("Status", 1), StatusPanel(status.label, status.tone, status.detail)])])
status = Query("get_public_status", {}, {label: "Checking status…", tone: "neutral", detail: "The latest status is loading."})
```

Query requirements:

- The operation must be `"query"`.
- The descriptor generated from the tool is marked read-only and
  non-destructive.
- Defaults in every OpenUI page must conform exactly to the output schema.
- Do not return secrets or data that is private merely because the upstream
  URL is internal.
- Bound upstream work, handle non-success responses, and return a stable shape.
- Add tests for schema rejection, output rejection, cancellation, and upstream
  failures when the tool has meaningful logic.

## Add a public mutation tool

A mutation changes state and executes only after the visitor activates an
explicit `Button` action. Its input schema must require a non-empty
`idempotencyKey`.

Add a mutation to `src/tools.ts`:

```ts
record_interest: {
  operation: "mutation",
  description:
    "Record public interest in a topic after an explicit visitor action.",
  input: z.object({
    idempotencyKey: z.string().min(1).max(128),
    topic: z.enum(["community-garden", "street-cleanup"]),
  }),
  output: z.object({
    accepted: z.literal(true),
    deduped: z.boolean(),
  }),
  async execute(
    input: Record<string, unknown>,
    { signal }: ToolExecutionContext,
  ) {
    const response = await fetch(
      "https://artifacts.internal/v1/group/public-interest",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
        signal,
      },
    );
    if (!response.ok) throw new Error("The interest could not be recorded.");
    return response.json();
  },
},
```

Declare it with `Mutation`, then make that declaration reachable exactly once
through the fourth `Button` argument:

```openui
root = Page("Garden", [Section(null, "plain", [Heading("Community garden", 1), Text("Tell the group you are interested in helping.", "muted"), Button(null, "I am interested", "primary", Action([@Run(interest)]))])])
interest = Mutation("record_interest", {idempotencyKey: "garden-interest-v1", topic: "community-garden"})
```

The static renderer validates the declaration and action reachability but never
executes the mutation. The browser invokes it only after the click.

Mutation requirements:

- The operation must be `"mutation"`.
- Require and honor `idempotencyKey` server-side. Define its scope deliberately:
  a source-stable key can represent one logical site action, while per-visitor
  behavior requires the server to include a visitor or session scope.
- Keep the mutation reachable from exactly one explicit
  `Button(..., Action([@Run(name)]))`.
- Never run a mutation from page load, a query, a hidden component, or custom
  component side effects.
- Validate intent and rate-limit the operation even though the endpoint is
  public.
- Assume a caller can invoke the public tool endpoint directly without
  rendering the page. The `Button` requirement is not authentication.
- Do not expose administrative behavior, credentials, or private data.
- Return a small, schema-validated result.

The current generated contract does not enable arbitrary `$state` bindings.
Do not invent binding syntax for form values. Supporting richer interactive
state is a deliberate runtime extension requiring browser, SSR, validation,
and security tests.

## Regenerate, validate, and publish

For page-only work, render every changed route:

```sh
pnpm --silent render -- /
pnpm --silent render -- /about
```

For component or tool work, also inspect the complete changes to:

- `src/library.tsx`, `src/tools.ts`, and `src/fixtures.ts`;
- `src/styles.css` when applicable;
- the page that exercises the extension; and
- any focused tests.

The only publication command is:

```sh
pnpm run deploy
```

In the configured Hermes environment it performs the complete transaction:

1. regenerates `generated/openui-catalog.json`;
2. regenerates `generated/openui-system-prompt.txt`;
3. regenerates the source-only `convos.site.json`;
4. type-checks the starter;
5. parses and fixture-renders every page;
6. live-renders the homepage with query fixtures;
7. stages the governed source paths and commits them if necessary;
8. pushes through the instance-bound internal Git proxy; and
9. activates that exact commit only after platform validation succeeds.

After extending `src/`, inspect the generated prompt and confirm the new
component signature or tool schema is exactly what page authors should use.
Never commit a manually edited generated file, `dist/`, or `public/`.

For draft work that must not publish, run `pnpm --silent render` and leave
publication to the configured environment. The generated contracts are
finalized by `pnpm run deploy`; do not approximate them by hand.

Optional local diagnostics use the pinned development dependencies directly:

```sh
pnpm exec tsc --noEmit
pnpm exec tsx --test scripts/render.test.ts scripts/lib/*.test.ts src/*.test.ts
```

## Troubleshooting

### `openui_parse_failed`

Check positional argument order, double-quoted strings, complete declarations,
and that `root = Page(...)` is the first statement.

### `openui_unknown_tool`

The tool name is absent from `src/tools.ts` or the page is using `Query` for a
mutation (or `Mutation` for a query). Read the generated prompt.

### `openui_query_invalid`

The arguments or defaults do not match the generated input/output schema.
The generated page-validation schema rejects unexpected properties; include
every required field with the correct type.

### `openui_mutation_invalid`

Check the required `idempotencyKey`, the exact mutation input shape, and the
`Button` → `Action` → `@Run` path.

### `openui_render_failed`

The React component may have received the wrong value type, rendered more or
less than one level-one heading, accessed a browser-only API during SSR, or
thrown while rendering.

### The local render uses unexpected data

`pnpm --silent render` uses `src/fixtures.ts`, not the network implementation
in `src/tools.ts`. Update the query fixture to the intended deterministic
shape.

### The page changed but the browser still shows the previous content

A normal pinned page checks every five seconds and reloads when its content
identity changes. Historical commit URLs are immutable and intentionally fetch
only once.

## File map

| File | Responsibility |
| --- | --- |
| `pages/**/*.openui` | Page content and composition |
| `src/library.tsx` | React components and component schemas |
| `src/tools.ts` | Public query/mutation registry and schemas |
| `src/fixtures.ts` | Deterministic local query results |
| `src/client.tsx` | Browser renderer and public tool provider |
| `src/server.tsx` | Strict parsing, query resolution, and static rendering |
| `src/catalog.ts` | Inert catalog derived from the runtime definitions |
| `src/prompt.ts` | Deterministic system-prompt generator |
| `src/styles.css` | Shared component styles |
| `package.json` | Exact dependencies and Worker client/server entrypoints |
| `convos.site.json` | Generated source manifest and aggregate identities |
| `generated/**` | Generated catalog and authoring prompt |
