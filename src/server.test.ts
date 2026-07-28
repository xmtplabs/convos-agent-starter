import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import worker, {
  OpenUiRenderError,
  RENDER_LIMITS,
  SITE_QUERY_COUNT_HEADER,
  SITE_QUERY_DURATION_HEADER,
  renderOpenUiDocument,
  type SiteEnvironment,
} from "./server.js";
import { createOpenUiSystemPrompt } from "./prompt.js";
import { createOpenUiSystemPrompt as createAuthoredPrompt } from "../scripts/lib/prompt.js";
import { fixtureGroup } from "./fixtures.js";
import {
  PAGE_BUNDLE_DIGEST_HEADER,
  SITE_BASE_PATH_HEADER,
  SITE_BUNDLE_DIGEST_HEADER,
} from "./runtime-contract.js";

const page = (children: string) =>
  `root = Page("Test page", [${children}])`;
const queryDefaults = JSON.stringify(fixtureGroup);
const bundleDigest = "a".repeat(64);
const committedPromptUrl = new URL(
  "../generated/openui-system-prompt.txt",
  import.meta.url,
);
const workerHeaders = {
  [SITE_BASE_PATH_HEADER]: "/sites/example",
  [SITE_BUNDLE_DIGEST_HEADER]: bundleDigest,
};

function testEnvironment(): SiteEnvironment {
  const values = new Map([
    ["/__convos/pages/index.openui", page('Heading("Home", 1)')],
    ["/__convos/pages/about.openui", page('Heading("About", 1)')],
    ["/client.js", "console.log('client')"],
    ["/styles.css", "body { color: black; }"],
  ]);
  return {
    ASSETS: {
      async fetch(request) {
        const path = new URL(request.url).pathname;
        const value = values.get(path);
        if (value === undefined) return new Response(null, { status: 404 });
        const etag = `"${createHash("sha256").update(value).digest("hex")}"`;
        const headers = {
          "content-type": path.endsWith(".css")
            ? "text/css"
            : path.endsWith(".js")
              ? "text/javascript"
              : "text/plain; charset=utf-8",
          etag,
        };
        if (request.headers.get("if-none-match") === etag) {
          return new Response(null, { status: 304, headers });
        }
        return new Response(request.method === "HEAD" ? null : value, {
          headers,
        });
      },
    },
  };
}

const render = (source: string, queryMode: "live" | "defaults" = "defaults") =>
  renderOpenUiDocument({
    source,
    queryMode,
    mountPath: "/sites/example",
    stylesheetPath: "/__convos/assets/site.css",
  });

test("requires a complete explicit root", async () => {
  await assert.rejects(
    render('page = Page("Test", [Heading("Test", 1)])'),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_parse_failed" &&
      error.phase === "parse",
  );
});

test("requires the explicit root to be the library Page component", async () => {
  await assert.rejects(
    render('root = Section(null, "plain", [Heading("Test", 1)])'),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_parse_failed",
  );
});

test("rejects unknown tools in defaults mode without outbound execution", async () => {
  await assert.rejects(
    render(
      [
        'data = Query("private_tool", {}, {})',
        page('Heading("Test", 1)'),
      ].join("\n"),
    ),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_unknown_tool",
  );
});

test("distinguishes query cycles from expression errors", async () => {
  await assert.rejects(
    render(
      [
        'left = Query("get_group", { dependency: right }, {})',
        'right = Query("get_group", { dependency: left }, {})',
        page('Heading("Test", 1)'),
      ].join("\n"),
    ),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_query_cycle",
  );
});

test("enforces the query-count limit before execution", async () => {
  const queries = Array.from(
    { length: RENDER_LIMITS.queryCount + 1 },
    (_, index) => `q${index} = Query("get_group", {}, {})`,
  );
  await assert.rejects(
    render([...queries, page('Heading("Test", 1)')].join("\n")),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_limit_exceeded",
  );
});

test("hard deadline rejects and aborts every outstanding query", async () => {
  let aborted = 0;
  await assert.rejects(
    renderOpenUiDocument({
      source: [
        'first = Query("get_group", {}, {})',
        'second = Query("get_group", {}, {})',
        page('Heading("Test", 1)'),
      ].join("\n"),
      queryMode: "live",
      mountPath: "/sites/example",
      stylesheetPath: "/__convos/assets/site.css",
      deadlineMs: 5,
      query: async (_name, _args, { signal }) =>
        new Promise<never>(() => {
          signal.addEventListener(
            "abort",
            () => {
              aborted += 1;
            },
            { once: true },
          );
        }),
    }),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_deadline_exceeded",
  );
  assert.equal(aborted, 2);
});

test("a Query completion after the absolute deadline cannot win a delayed timer", async () => {
  let now = 0;
  await assert.rejects(
    renderOpenUiDocument({
      source: [
        `group = Query("get_group", {}, ${queryDefaults})`,
        page('Heading("Test", 1)'),
      ].join("\n"),
      queryMode: "live",
      mountPath: "/sites/example",
      stylesheetPath: "/__convos/assets/site.css",
      deadlineMs: 5,
      now: () => now,
      query: async () => {
        now = 6;
        return fixtureGroup;
      },
    }),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_deadline_exceeded",
  );
});

test("synchronous phase boundaries check elapsed wall-clock time", async () => {
  let clockReads = 0;
  await assert.rejects(
    renderOpenUiDocument({
      source: page('Heading("Test", 1)'),
      queryMode: "defaults",
      mountPath: "/sites/example",
      stylesheetPath: "/__convos/assets/site.css",
      deadlineMs: 5,
      now: () => (clockReads++ === 0 ? 0 : 6),
    }),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_deadline_exceeded",
  );
});

test("executes no more than four independent Queries concurrently", async () => {
  let active = 0;
  let maximum = 0;
  const queries = Array.from(
    { length: 5 },
    (_, index) => `q${index} = Query("get_group", {}, {})`,
  );
  await renderOpenUiDocument({
    source: [...queries, page('Heading("Test", 1)')].join("\n"),
    queryMode: "live",
    mountPath: "/sites/example",
    stylesheetPath: "/__convos/assets/site.css",
    query: async () => {
      active += 1;
      maximum = Math.max(maximum, active);
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      active -= 1;
      return fixtureGroup;
    },
  });
  assert.equal(maximum, RENDER_LIMITS.queryConcurrency);
});

test("enforces per-result and aggregate Query byte limits", async () => {
  const source = [
    'members = Query("get_members", {}, [])',
    page('Heading("Test", 1)'),
  ].join("\n");
  await assert.rejects(
    renderOpenUiDocument({
      source,
      queryMode: "live",
      mountPath: "/sites/example",
      stylesheetPath: "/__convos/assets/site.css",
      query: async () => [
        {
          inbox_id: "member",
          member_kind: "member",
          name: "x".repeat(RENDER_LIMITS.queryResultBytes),
        },
      ],
    }),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_limit_exceeded",
  );

  const queries = Array.from(
    { length: 5 },
    (_, index) => `members${index} = Query("get_members", {}, [])`,
  );
  await assert.rejects(
    renderOpenUiDocument({
      source: [...queries, page('Heading("Test", 1)')].join("\n"),
      queryMode: "live",
      mountPath: "/sites/example",
      stylesheetPath: "/__convos/assets/site.css",
      query: async () => [
        {
          inbox_id: "member",
          member_kind: "member",
          name: "x".repeat(220_000),
        },
      ],
    }),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_limit_exceeded",
  );
});

test("enforces the final HTML byte limit after escaping Query data", async () => {
  const queries = Array.from(
    { length: 4 },
    (_, index) => `group${index} = Query("get_group", {}, {})`,
  );
  const content = Array.from(
    { length: 4 },
    (_, index) => `Text(group${index}.name)`,
  ).join(", ");
  await assert.rejects(
    renderOpenUiDocument({
      source: [...queries, page(`Heading("Test", 1), ${content}`)].join("\n"),
      queryMode: "live",
      mountPath: "/sites/example",
      stylesheetPath: "/__convos/assets/site.css",
      query: async () => ({
        ...fixtureGroup,
        name: "<".repeat(140_000),
      }),
    }),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_limit_exceeded" &&
      error.phase === "limit",
  );
});

test("validates mutation schema without executing mutations", async () => {
  let queryCalls = 0;
  const result = await renderOpenUiDocument({
    source: [
      'send = Mutation("send_to_agent", { idempotencyKey: "fixture-1", body: { message: "hello" } })',
      page('Heading("Test", 1)'),
    ].join("\n"),
    queryMode: "live",
    mountPath: "/sites/example",
    stylesheetPath: "/__convos/assets/site.css",
    query: async () => {
      queryCalls += 1;
      return {};
    },
  });
  assert.equal(queryCalls, 0);
  assert.match(result.html, /<h1>Test<\/h1>/);
});

test("reports root render failures separately from parser failures", async () => {
  await assert.rejects(
    render(
      [
        `group = Query("get_group", {}, ${queryDefaults})`,
        page("Heading(group, 1)"),
      ].join("\n"),
    ),
    (error: unknown) =>
      error instanceof OpenUiRenderError &&
      error.code === "openui_render_failed",
  );
});

test("static output is mounted, styled, accessible, and script-free", async () => {
  const result = await render(
    page(
      'Heading("Test", 1), Alert("Stop", "Something failed.", "danger"), Link("/about", "About")',
    ),
  );
  assert.match(result.html, /<base href="\/sites\/example\/">/);
  assert.match(result.html, /href="__convos\/assets\/site.css"/);
  assert.match(result.html, /href="about"/);
  assert.match(result.html, /role="alert"/);
  assert.match(result.html, /aria-live="assertive"/);
  assert.equal((result.html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
  assert.doesNotMatch(result.html, /<script/i);
  assert.doesNotMatch(result.html, /queryData|resolvedSource/);
});

test("default Worker serves pages, assets, rendering, and tools from its mount", async () => {
  const environment = testEnvironment();
  const shell = await worker.fetch(
    new Request("https://site.test/sites/example/", {
      headers: workerHeaders,
    }),
    environment,
  );
  assert.equal(shell.status, 200);
  assert.match(await shell.text(), /<base href="\/sites\/example\/">/);
  assert.match(
    await (
      await worker.fetch(
        new Request("https://site.test/sites/example/", {
          headers: workerHeaders,
        }),
        environment,
      )
    ).text(),
    /"route":"\/","bundleDigest":"a{64}","historical":false/,
  );

  const source = await worker.fetch(
    new Request(
      "https://site.test/sites/example/__convos/page?route=%2Fabout",
      { headers: workerHeaders },
    ),
    environment,
  );
  assert.equal(source.status, 200);
  assert.equal(source.headers.get(PAGE_BUNDLE_DIGEST_HEADER), bundleDigest);
  assert.match(await source.text(), /Heading\("About", 1\)/);

  const stylesheet = await worker.fetch(
    new Request("https://site.test/sites/example/styles.css", {
      headers: workerHeaders,
    }),
    environment,
  );
  assert.equal(stylesheet.status, 200);
  assert.equal(await stylesheet.text(), "body { color: black; }");

  const response = await worker.fetch(
    new Request("https://site.test/sites/example/__convos/render?query_mode=defaults", {
      method: "POST",
      headers: {
        "content-type": "text/plain",
        ...workerHeaders,
      },
      body: page('Heading("Test", 1)'),
    }),
    environment,
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
  assert.equal(response.headers.get(SITE_QUERY_COUNT_HEADER), "0");
  assert.match(response.headers.get(SITE_QUERY_DURATION_HEADER) ?? "", /^\d+$/);

  const problem = await worker.fetch(
    new Request("https://site.test/sites/example/__convos/tools", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...workerHeaders,
      },
      body: JSON.stringify({ name: "private_tool", arguments: {} }),
    }),
    environment,
  );
  assert.equal(problem.status, 404);
  assert.match(
    problem.headers.get("content-type") ?? "",
    /^application\/problem\+json/,
  );
  const body = (await problem.json()) as Record<string, unknown>;
  assert.equal(body.code, "openui_unknown_tool");
  assert.equal(Object.hasOwn(body, "stack"), false);
});

test("default Worker preserves historical mounts and immutable page shells", async () => {
  const historicalMount = `/site-versions/example/${"b".repeat(40)}`;
  const response = await worker.fetch(
    new Request(`https://site.test${historicalMount}/about`, {
      headers: {
        [SITE_BASE_PATH_HEADER]: historicalMount,
        [SITE_BUNDLE_DIGEST_HEADER]: bundleDigest,
      },
    }),
    testEnvironment(),
  );
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=31536000, immutable",
  );
  const body = await response.text();
  assert.match(
    body,
    new RegExp(`<base href="${historicalMount}/">`),
  );
  assert.match(
    body,
    /"route":"\/about","bundleDigest":"a{64}","historical":true/,
  );
});

test("Worker rejects malformed UTF-8 request bodies", async () => {
  const environment = testEnvironment();
  for (const [path, contentType] of [
    ["/__convos/render?query_mode=defaults", "text/plain"],
    ["/__convos/tools", "application/json"],
  ] as const) {
    const response = await worker.fetch(
      new Request(`https://site.test/sites/example${path}`, {
        method: "POST",
        headers: {
          "content-type": contentType,
          ...workerHeaders,
        },
        body: new Uint8Array([0xc3, 0x28]),
      }),
      environment,
    );
    assert.equal(response.status, 400);
    const body = (await response.json()) as Record<string, unknown>;
    assert.equal(body.code, "openui_invalid_request");
  }
});

test("default Worker does not dispatch near-match paths to reserved handlers", async () => {
  const commonHeaders = {
    "content-type": "text/plain",
    ...workerHeaders,
  };
  const environment = testEnvironment();
  for (const [path, status] of [
    ["/sites/example/nested/__convos/render", 405],
    ["/sites/example/not-__convos/render", 405],
    ["/sites/other/__convos/render", 404],
  ] as const) {
    const response = await worker.fetch(
      new Request(`https://site.test${path}?query_mode=defaults`, {
        method: "POST",
        headers: commonHeaders,
        body: page('Heading("Test", 1)'),
      }),
      environment,
    );
    assert.equal(response.status, status);
    assert.equal(response.headers.get(SITE_QUERY_COUNT_HEADER), null);
  }
});

test("the committed prompt is byte-identical to the shared generator and digest vector", async () => {
  const committedPrompt = await readFile(committedPromptUrl);
  const committedDigest = createHash("sha256").update(committedPrompt).digest("hex");
  assert.equal(createAuthoredPrompt, createOpenUiSystemPrompt);
  assert.equal(committedPrompt.toString("utf8"), createOpenUiSystemPrompt());
  assert.equal(committedDigest, "ef86f19eaa67198c10567f6cce284659837c5c0aae23b905681e76d894429918");
});
