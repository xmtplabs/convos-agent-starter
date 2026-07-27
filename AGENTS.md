# Agent site starter

Use `pnpm` only. Dependencies are exact-pinned; do not update them unless
explicitly asked. Site-authoring requests follow
[`skills/manage-agent-site/SKILL.md`](skills/manage-agent-site/SKILL.md).
This OpenUI format lives on `07-24-openui-agent-sites`; never deploy or commit
site-format changes to the preserved `07-23-agent-sites` branch.

`pages/**/*.openui` is the page and layout surface. Before changing a site,
read `generated/openui-system-prompt.txt` in full and use its catalog. Edit
`src/` only when that catalog cannot express the requested component or tool.
For extension patterns and complete examples, read
[`skills/manage-agent-site/EXTENDING.md`](skills/manage-agent-site/EXTENDING.md).

`generated/openui-system-prompt.txt` and `convos.site.json` are generated,
committed source contracts. Regenerate them only through `pnpm run deploy`.
`dist/` and `public/` are not source artifacts and must remain absent.

`pnpm --silent render -- <route-or-file>` produces static fixture HTML without
changing the checkout. It writes only complete HTML to stdout on success;
failures write stable JSON to stderr and exit nonzero. `pnpm run deploy`
validates, commits, pushes, and activates the exact
commit only after all local checks succeed.
