---
name: manage-agent-site
description: Build, redesign, repair, locally preview, test, and publish this assistant's React Router Dynamic Worker site from its workspace repository. Use whenever the user asks to create, change, customize, fix, preview, test, deploy, or publish the group website, web app, landing page, member experience, site content, or site behavior.
---

# Manage Agent Site

Work from the current directory. It is `$WORKSPACE_DIR`, the assistant's private
Git checkout, and it contains the complete site. Use the existing React Router,
Cloudflare Vite, Tailwind, and shadcn/ui setup instead of replacing the stack.

Treat a request to change or update the site as a request for a live outcome:
implement, validate, and publish it. Stop before publishing only when the user
asks for a draft, local preview, or no deployment.

## Start safely

Inspect the checkout and preserve unrelated work:

```bash
pwd
git status --short
git branch --show-current
```

Install the exact locked dependencies once after a fresh runtime clone:

```bash
test -x node_modules/.bin/vite || pnpm install --frozen-lockfile
```

Use `pnpm`, never `npm` or `yarn`. Node, pnpm, Git, curl, ripgrep, Python, and
native build tools are already available in the runtime. Do not print, copy,
persist, or modify the injected Git or runtime credentials.

Print this assistant's stable live URL at any time:

```bash
pnpm site:url
```

This validates the runtime-provided public base URL and instance ID, makes no
network request, and prints only the public pinned URL. Use its exact output;
do not inspect environment variables or reconstruct the URL by hand.

## Interpret limited instructions

Read the current root, affected routes, theme, and relevant components before
choosing an approach. Identify the audience, the page's primary purpose or
action, authoritative facts available from the user or loaders, and useful
behavior that should remain.

Choose one coherent interpretation and implement it completely. Make reasonable
decisions about layout, spacing, color, and copy without asking. Ask only when
missing information would materially change the site's purpose, expose private
information, or require inventing important facts. Prefer a focused edit over a
rewrite when the request is narrow.

Never publish invented dates, prices, locations, availability, testimonials,
statistics, or real-world status. Clearly label intentional demonstration data.

## Know the project

The important source files are:

- `src/root.tsx`: document shell and root loader.
- `src/routes.ts`: route table.
- `src/routes/*.tsx`: route loaders, actions, and UI.
- `src/lib/artifacts.server.ts`: server-only entry to assistant capabilities.
- `src/lib/artifacts-api.ts`: typed `artifacts.internal` client.
- `src/lib/artifacts.types.ts`: capability data types.
- `src/lib/artifacts.fixtures.ts`: local-development sample data only.
- `src/lib/google-maps-public.ts`: intentionally public, domain-restricted
  Google Maps browser configuration.
- `src/components/ui/`: locally owned shadcn/ui primitives.
- `src/styles/globals.css`: Tailwind import and semantic theme variables.
- `workers/app.ts`: production React Router Worker adapter.
- `workers/preview.ts`: exact local Dynamic Worker host preview.

`dist/`, `public/`, and `convos.site.json` are generated deployment artifacts.
Never edit them manually. `pnpm build` deletes and recreates `dist/` and
`public/`, then writes and verifies the single complete manifest. Put source
assets under `src/` and import them through Vite; do not place source files in
the generated `public/` directory.

## Build the UI

Compose the committed shadcn/ui primitives before inventing replacements.
Preserve the semantic theme tokens in `src/styles/globals.css`, responsive
layouts, keyboard behavior, visible focus states, and useful empty, loading,
and error states. Use real labels and accessible names for controls.

Give every page a clear primary message, an obvious next action when one exists,
and supporting content ordered by importance. Avoid a grid of equally weighted
cards when the content has a natural hierarchy; use cards only for genuinely
distinct objects or choices.

Use a restrained type scale, consistent spacing, and one clear accent treatment.
Prefer composition and whitespace over decorative effects. Avoid generic
landing-page filler, excessive pills, glowing gradients, vague hero copy, and
repeating the same container treatment around every section. Make narrow-screen
layouts intentional instead of merely wrapping the desktop layout.

Add one missing shadcn component deliberately with:

```bash
pnpm ui:add -- <component-name>
```

This command owns the generated source, restricts changes to configured paths,
and exact-pins any dependency it introduces. Inspect its diff before use.

### Load a component recipe only when needed

The skill includes complete, typechecked recipes for common rich responses.
Read only the reference matching the user's request, then copy and adapt it
under `src/`; these reference files are examples and are not bundled into the
site automatically.

- For posters, movie titles, theaters, formats, and showtimes, read
  [movie-showtimes.tsx](references/movie-showtimes.tsx).
- For departure and arrival times, airports, gates, duration, and status, read
  [flight-details.tsx](references/flight-details.tsx).
- For multi-day agendas with semantic times, locations, speakers, and session
  status, read [event-schedule.tsx](references/event-schedule.tsx).
- For a responsive image grid with captions and an accessible lightbox, read
  [photo-gallery.tsx](references/photo-gallery.tsx).
- For dated milestones, progress, and status in chronological order, read
  [timeline.tsx](references/timeline.tsx).
- For an interactive Google Map with exact coordinates and an accessible point
  list, read [google-map-points.tsx](references/google-map-points.tsx).
- For a provider-neutral map image with accessible numbered points, read
  [point-map.tsx](references/point-map.tsx).
- For selectable cards that deliver a vote to the agent through a React Router
  action, read
  [voting-cards-route.tsx](references/voting-cards-route.tsx).

Replace sample data and placeholder URLs with loader-provided data. Preserve
the recipes' responsive layout, semantic times, image alt text, keyboard
behavior, server-only capability calls, and explicit empty/error states. The
voting recipe is message-based feedback, not authenticated one-person-one-vote.

Keep every route valid under both platform mount shapes:

- `/sites/:instance_id/...`
- `/site-versions/:instance_id/:commit_sha/...`

Use React Router `Link`, `NavLink`, `Form`, loaders, and actions. Do not hardcode
the deployment origin, instance ID, commit SHA, or a root-relative site mount.
The document's `<base>` and the Worker's React Router `basename` adapt at
runtime. Prefer imported assets and route-relative URLs.

## Use assistant data and actions

Load capabilities on the server:

```ts
import { getArtifactsClient } from "@/lib/artifacts.server";

export async function loader({ context }: Route.LoaderArgs) {
  const artifacts = await getArtifactsClient(context);
  return artifacts.bootstrap();
}
```

Never import `artifacts.server.ts` from a client-only module and never call
`https://artifacts.internal` from browser code. The platform intercepts that
hostname only for server-side Worker fetches. Production never falls back to
fixtures.

Treat user-provided and loader data as authoritative. Derive display formatting
only when the transformation is deterministic. Do not expose conversation IDs,
inbox IDs, arbitrary metadata, internal errors, or implementation details unless
the user specifically requests them.

The typed client supports:

- `bootstrap()` for group info, assistant profile, and member profiles together.
- `groupInfo()`, `groupMembers()`, and `agentInfo()` for individual reads.
- `getText(key)` and `setText(key, value)` for assistant-scoped SQLite text.
- `sendToAgent({ idempotencyKey, body })` to enqueue a site event for this
  assistant.

Call reads from loaders. Call `setText` and `sendToAgent` only from actions
caused by an intentional user mutation; never mutate during render, module
initialization, or a loader. Give every event a meaningful, stable idempotency
key so retries do not create duplicate agent turns.

Validate every submitted field on the server. Give each mutation a pending state
that prevents accidental duplicates plus visible success and failure feedback.
Namespace stored keys by feature, such as `poll:summer-trip:title`, and keep
stored values compatible with historical site versions that may still read or
write them.

Stored text and delivered events are shared by all deployed and historical
versions of this assistant. Keep keys at most 256 UTF-8 bytes, values at most 64
KiB, event keys at most 128 UTF-8 bytes, and event JSON at most 256 KiB.

Normal server-side HTTP and HTTPS requests have network access.
`artifacts.internal` is reserved for the injected API, and raw TCP is not
available. The public proxy strips credentials and cookies, so do not design
the site around cookie sessions, inbound `Authorization`, `Set-Cookie`, or
private browser-held secrets. Treat every public request and form field as
untrusted input.

Prefer committed assets imported from `src/` over remote hotlinks. Give images
meaningful alt text and explicit dimensions or aspect ratios. When a requested
asset is unavailable, use a deliberate local placeholder and tell the user what
needs replacement; never silently substitute an unrelated image.

## Iterate locally

Use the fast fixture-backed Vite server while editing:

```bash
pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

It provides HMR and typed sample group, assistant, member, text, and event data.
Exercise the page and form actions at `http://127.0.0.1:5173/`. If a graphical
browser is unavailable inside the runtime, use `curl --fail --silent
--show-error` to inspect status, HTML, redirects, resources, and action
responses. Keep the server in a terminal session or background it while
testing, then stop that exact process; do not leave preview processes running.

Use the platform preview before publishing:

```bash
pnpm preview:platform
```

This builds first, verifies `convos.site.json`, materializes the bundle through
local KV, loads it with the Dynamic Worker loader, applies the production
outbound and response policies, validates `GET /`, and hosts both mount forms.
Request `http://127.0.0.1:8787/` for JSON containing the exact `pinned` and
`historical` preview paths, then request both returned paths. This preview still
uses typed fixture data; only a deployed site uses live conversation data.

Use `pnpm dev` for the short feedback loop and `pnpm preview:platform` for the
final platform-compatibility check. Do not use `wrangler deploy`; this
application is deployed as a bundle inside the assistant Worker.

## Validate

Before publishing, run:

```bash
pnpm check
pnpm build
git diff --check
git status --short
```

`pnpm check` runs React Router type generation, TypeScript, and unit tests.
`pnpm build` bundles client and server code and rejects missing, stale,
oversized, unsafe, or hash-mismatched artifacts. The platform limits the
manifest to 1,000 files total, so keep the application bundled instead of
generating many small static files.

Confirm that:

- `/` returns HTTP 200 in both local modes.
- links, redirects, form actions, and assets work beneath both mount paths.
- loaders render useful fixture data without client-side
  `artifacts.internal` calls.
- narrow mobile and normal desktop layouts have deliberate hierarchy and no
  clipped or overlapping content.
- long labels, empty collections, pending submissions, success, and failure
  states remain usable.
- keyboard focus order and visible focus states work for every interaction.
- client hydration produces no console errors when a browser is available.
- the diff contains only intentional source, dependency, generated artifact,
  and manifest changes.

## Publish

Publish only after reviewing the entire diff. The publish command stages every
workspace change, so remove temporary files and do not proceed when unrelated
or suspicious changes are present.

```bash
pnpm deploy
```

This single command:

1. rebuilds and validates the site;
2. stages source plus `dist/`, `public/`, and `convos.site.json`;
3. creates a commit when the checkout changed;
4. pushes the current branch to this assistant's code.storage repository using
   a process-only credential helper; and
5. synchronously asks `runtime.internal` to materialize, validate, and pin that
   exact commit.

It prints the live pinned URL only after the new commit returns HTTP 200 from
`GET /` and activation succeeds. A failed build, push, materialization, or
validation leaves the previous pinned commit live. Fix the reported error and
run `pnpm deploy` again; do not bypass activation with a manual Git push or raw
runtime request.

After success, request the printed URL and report the live outcome concisely.
Use the printed URL rather than constructing one from environment values.
Reprint the same stable pinned URL later with `pnpm site:url`. Describe what
changed from the visitor's perspective rather than listing files.
