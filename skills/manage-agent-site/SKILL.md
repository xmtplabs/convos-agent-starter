---
name: manage-agent-site
description: Author, validate, and publish this assistant's OpenUI site. Use for any request to create, change, preview, repair, test, deploy, or publish the group site.
---

# Manage Agent Site

Work from the current assistant-site checkout and use `pnpm` only. A normal
site request is a live outcome: make the requested change and run `pnpm run deploy`
unless the user explicitly asks for a draft or no publication.

## Author OpenUI first

Before touching a page, read
[`generated/openui-system-prompt.txt`](../../generated/openui-system-prompt.txt)
in full. It is the exact component and public-tool catalog for the current
runtime. Then inspect the relevant `pages/**/*.openui` document.

Put content and layout changes in `pages/**/*.openui` by default. Reuse a
catalogued component and tool whenever it can express the request. Do not
invent component or tool names. Change `src/` only when the generated catalog
cannot express the request; when it does, update the source-owned library or
public tool registry deliberately, then regenerate the prompt and
complete deployment checks.

When the request requires a new component or public tool, read
[`EXTENDING.md`](EXTENDING.md) and follow its schema, fixture, SSR, mutation,
and generated-contract guidance.

Pages use static, case-sensitive routes: `pages/index.openui` is `/`,
`pages/about.openui` is `/about`, and `pages/docs/index.openui` is `/docs`.
Do not create dynamic paths, dot segments, encoded separators, or backslashes.
Use local asset paths from `assets/` and preserve accessible labels, text
alternatives, focus behavior, and useful loading, empty, stale, and error
states.

Every registered tool is public. Never add credentials, private data, or
administrative tools to the site registry. Use `Query` only with tools marked
as queries in the generated catalog. Use `Mutation` only with catalogued
mutation tools, only from an explicit visitor-activated `Button` action, and
always with the schema's required idempotency key. Static rendering validates
mutations but never executes them. Treat user data as untrusted and validate it
at the tool boundary.

## Validate and publish

Install the exact lockfile once in a fresh checkout:

```sh
pnpm install --frozen-lockfile
```

Inspect static, fixture-backed output without modifying the checkout:

```sh
pnpm --silent render -- /
pnpm --silent render -- pages/about.openui
```

On success the command writes only complete HTML to stdout. On failure it
writes stable JSON to stderr and exits nonzero.

Before publication, inspect `git status --short` and the complete diff. The
only publication command is:

```sh
pnpm run deploy
```

It regenerates and verifies the committed prompt and v2 source manifest,
type-checks runtime code, parses every page, fixture-renders the homepage,
commits the governed source paths, pushes through the instance-bound internal
Git proxy with a hermetic Git environment, and asks the platform to activate
that exact commit. It prints a pinned URL only after activation succeeds. Do
not use manual Git pushes, raw deployment requests, bundle commands, Vite,
Wrangler, or generated browser artifacts.

`dist/` and `public/` are intentionally ignored and absent. Do not create or
commit them.
