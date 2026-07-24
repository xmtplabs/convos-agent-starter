# Agent site starter

Use `pnpm` only. Dependencies are exact-pinned; do not widen or update them unless explicitly asked.

`src/components/ui` contains locally owned shadcn/ui primitives. Compose those before adding a component, and edit a primitive only when its change should become the repository standard. Keep the semantic theme variables in `src/styles/globals.css` intact.

`dist/`, `public/`, and `convos.site.json` are generated deployment artifacts. Run `pnpm build` after source changes, then commit all three together. Do not edit the manifest by hand.

Capability calls stay in `src/lib/artifacts.server.ts`; never import that module from client components.

`pnpm dev` uses the explicitly configured local fixture KV. Production builds never fall back to fixtures. `pnpm preview:platform` builds first, then serves the committed artifact contract through a local Worker Loader at both the pinned and historical mount paths printed by the preview root.

`pnpm site:url` prints this assistant's stable pinned site URL from the runtime-provided public base URL and instance ID without making a network request.

`pnpm deploy` requires `CODE_STORAGE_GIT_URL`, `CODE_STORAGE_GIT_TOKEN`, `POOL_URL`, `PUBLIC_BASE_URL`, and `INSTANCE_ID` from the assistant runtime. It commits generated output when needed, pushes with a process-only credential helper, and prints the pinned URL only after synchronous activation confirms the pushed SHA.
