import assert from "node:assert/strict";
import test from "node:test";
import type { ReactElement } from "react";
import {
  callPublicTool,
  OpenUiRenderer,
  readShellMetadata,
} from "./client.js";
import { toMountUrl } from "./library.js";
import {
  classifyPageResponse,
  OpenUiPageController,
  type PagePollerDependencies,
} from "./use-openui-page.js";
import { PAGE_BUNDLE_DIGEST_HEADER } from "./runtime-contract.js";

const pageResponse = (
  body: string,
  status = 200,
  bundleDigest = "bundle",
) =>
  new Response(status === 304 ? null : body, {
    status,
    headers: {
      etag: '"page"',
      [PAGE_BUNDLE_DIGEST_HEADER]: bundleDigest,
      "x-convos-content-digest": "content",
      "x-convos-page-digest": "page",
    },
  });

test("reads the exact JSON shell metadata contract", () => {
  const digest = "a".repeat(64);
  const script = {
    type: "application/json",
    textContent: JSON.stringify({
      route: "/about",
      bundleDigest: digest,
      historical: true,
    }),
  };
  const page = {
    getElementById(id: string) {
      return id === "convos-site" ? script : null;
    },
  };
  const original = globalThis.HTMLScriptElement;
  class ScriptElement {}
  Object.setPrototypeOf(script, ScriptElement.prototype);
  Object.defineProperty(globalThis, "HTMLScriptElement", {
    configurable: true,
    value: ScriptElement,
  });
  try {
    assert.deepEqual(
      readShellMetadata(page as unknown as Document),
      {
        route: "/about",
        bundleDigest: digest,
        historical: true,
      },
    );
  } finally {
    Object.defineProperty(globalThis, "HTMLScriptElement", {
      configurable: true,
      value: original,
    });
  }
});

test("rejects malformed or incomplete shell metadata", () => {
  const original = globalThis.HTMLScriptElement;
  class ScriptElement {}
  Object.defineProperty(globalThis, "HTMLScriptElement", {
    configurable: true,
    value: ScriptElement,
  });
  try {
    for (const value of [
      "{",
      JSON.stringify({ route: "/", bundleDigest: "short", historical: false }),
      JSON.stringify({
        route: "/",
        bundleDigest: "a".repeat(64),
        historical: false,
        extra: true,
      }),
    ]) {
      const script = { type: "application/json", textContent: value };
      Object.setPrototypeOf(script, ScriptElement.prototype);
      assert.throws(() =>
        readShellMetadata({
          getElementById: () => script,
        } as unknown as Document),
      );
    }
  } finally {
    Object.defineProperty(globalThis, "HTMLScriptElement", {
      configurable: true,
      value: original,
    });
  }
});

test("page polling classifies status before bundle identity", () => {
  assert.equal(classifyPageResponse(404, "bundle", "bundle", false), "fail");
  assert.equal(
    classifyPageResponse(404, "bundle", "bundle", true),
    "removed",
  );
  assert.equal(classifyPageResponse(304, "bundle", "bundle", false), "fail");
  assert.equal(classifyPageResponse(200, null, "bundle", false), "fail");
  assert.equal(
    classifyPageResponse(304, "bundle", "bundle", true),
    "unchanged",
  );
  assert.equal(
    classifyPageResponse(200, "new-bundle", "bundle", true),
    "reload",
  );
  assert.equal(
    classifyPageResponse(503, "new-bundle", "bundle", true),
    "transient",
  );
});

test("an initial 404 surfaces an error without reloading", async () => {
  let reloads = 0;
  const controller = new OpenUiPageController(
    { route: "/missing", expectedBundleDigest: "bundle", historical: false },
    {
      fetchPage: async () => pageResponse("missing", 404),
      visible: () => true,
      reload: () => {
        reloads += 1;
      },
      setTimer: () => 1,
      clearTimer: () => undefined,
    },
    () => undefined,
  );

  await controller.start();
  assert.deepEqual(controller.getState(), {
    status: "error",
    source: null,
    stale: false,
    error: "The page could not be loaded (404).",
    headers: Object.create(null),
  });
  assert.equal(reloads, 0);
  controller.stop();
});

test("a removed pinned route reloads once after a successful fetch", async () => {
  let fetches = 0;
  let reloads = 0;
  const controller = new OpenUiPageController(
    { route: "/current", expectedBundleDigest: "bundle", historical: false },
    {
      fetchPage: async () => {
        fetches += 1;
        return fetches === 1 ? pageResponse("current") : pageResponse("", 404);
      },
      visible: () => true,
      reload: () => {
        reloads += 1;
      },
      setTimer: () => 1,
      clearTimer: () => undefined,
    },
    () => undefined,
  );

  await controller.start();
  await controller.check();
  await controller.check();
  assert.equal(reloads, 1);
  assert.equal(fetches, 2);
});

test("a historical route 404 never reloads", async () => {
  let fetches = 0;
  let reloads = 0;
  const controller = new OpenUiPageController(
    { route: "/older", expectedBundleDigest: "bundle", historical: true },
    {
      fetchPage: async () => {
        fetches += 1;
        return fetches === 1 ? pageResponse("older") : pageResponse("", 404);
      },
      visible: () => true,
      reload: () => {
        reloads += 1;
      },
      setTimer: () => 1,
      clearTimer: () => undefined,
    },
    () => undefined,
  );

  await controller.start();
  await controller.check();
  assert.equal(reloads, 0);
  assert.equal(controller.getState().source, "older");
  assert.equal(controller.getState().stale, true);
  controller.stop();
});

test("pinned polling is delayed, non-overlapping, visibility-aware, and stale-safe", async () => {
  let visible = true;
  let reloads = 0;
  let fetches = 0;
  let resolveSecond:
    | ((response: Response) => void)
    | undefined;
  const timers: Array<{
    callback: () => void;
    delay: number;
    cleared: boolean;
  }> = [];
  const dependencies: PagePollerDependencies = {
    async fetchPage() {
      fetches += 1;
      if (fetches === 1) return pageResponse("first");
      if (fetches === 2) {
        return new Promise<Response>((resolve) => {
          resolveSecond = resolve;
        });
      }
      return pageResponse("", 304);
    },
    visible: () => visible,
    reload: () => {
      reloads += 1;
    },
    setTimer(callback, delay) {
      const timer = { callback, delay, cleared: false };
      timers.push(timer);
      return timer;
    },
    clearTimer(timer) {
      (timer as (typeof timers)[number]).cleared = true;
    },
  };
  const changes: string[] = [];
  const controller = new OpenUiPageController(
    { route: "/", expectedBundleDigest: "bundle", historical: false },
    dependencies,
    (state) => changes.push(`${state.status}:${state.source}:${state.stale}`),
  );

  await controller.start();
  assert.equal(fetches, 1);
  assert.equal(timers.at(-1)?.delay, 5_000);

  const second = controller.check();
  assert.equal(fetches, 2);
  await controller.check();
  assert.equal(fetches, 2);
  const finishSecond = resolveSecond as unknown as (response: Response) => void;
  finishSecond(pageResponse("error", 503, "new-bundle"));
  await second;
  assert.equal(controller.getState().source, "first");
  assert.equal(controller.getState().stale, true);
  assert.equal(reloads, 0);

  visible = false;
  controller.visibilityChanged();
  assert.equal(timers.at(-1)?.cleared, true);
  visible = true;
  controller.visibilityChanged();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  assert.equal(fetches, 3);
  assert.equal(controller.getState().stale, false);
  assert.ok(changes.includes("ready:first:true"));
  controller.stop();
});

test("historical polling fetches once and ignores visibility and online events", async () => {
  let fetches = 0;
  let timers = 0;
  const controller = new OpenUiPageController(
    { route: "/", expectedBundleDigest: "bundle", historical: true },
    {
      fetchPage: async () => {
        fetches += 1;
        return pageResponse("historical");
      },
      visible: () => true,
      reload: () => undefined,
      setTimer: () => {
        timers += 1;
        return timers;
      },
      clearTimer: () => undefined,
    },
    () => undefined,
  );
  await controller.start();
  controller.visibilityChanged();
  controller.online();
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  assert.equal(fetches, 1);
  assert.equal(timers, 0);
  controller.stop();
});

test("stopping polling aborts an in-flight page request", async () => {
  let aborted = false;
  const controller = new OpenUiPageController(
    { route: "/", expectedBundleDigest: "bundle", historical: false },
    {
      fetchPage: async (_input, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            "abort",
            () => {
              aborted = true;
              reject(new DOMException("aborted", "AbortError"));
            },
            { once: true },
          );
        }),
      visible: () => true,
      reload: () => undefined,
      setTimer: () => 1,
      clearTimer: () => undefined,
    },
    () => undefined,
  );
  const starting = controller.start();
  await Promise.resolve();
  controller.stop();
  await starting;
  assert.equal(aborted, true);
});

test("content-only source changes preserve Renderer type and key", () => {
  const first = OpenUiRenderer({ source: "first" }) as ReactElement<{
    response: string;
  }>;
  const second = OpenUiRenderer({ source: "second" }) as ReactElement<{
    response: string;
  }>;
  assert.equal(first.type, second.type);
  assert.equal(first.key, null);
  assert.equal(second.key, null);
  assert.equal(first.props.response, "first");
  assert.equal(second.props.response, "second");
});

test("component URLs remain inside the current mount", () => {
  assert.equal(toMountUrl("/"), ".");
  assert.equal(toMountUrl("/about"), "about");
  assert.equal(toMountUrl("/images/team.png"), "images/team.png");
  assert.equal(
    toMountUrl("https://example.com/image.png"),
    "https://example.com/image.png",
  );
});

test("browser tool provider sends the exact public envelope", async () => {
  const originalFetch = globalThis.fetch;
  let received: unknown;
  globalThis.fetch = async (_input: RequestInfo | URL, init?: RequestInit) => {
    received = JSON.parse(String(init?.body));
    return Response.json({ ok: true });
  };
  try {
    await callPublicTool("get_group", {});
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.deepEqual(received, { name: "get_group", arguments: {} });
});
