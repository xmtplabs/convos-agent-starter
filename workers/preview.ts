import { DurableObject, WorkerEntrypoint } from "cloudflare:workers";
import artifact from "../.preview/artifact.mjs";
import { createFixtureArtifactsTransport } from "@/lib/artifacts.fixtures";

const BASE_PATH_HEADER = "x-convos-site-base-path";
const materializedKey = `preview:materialized:${artifact.manifest.artifactDigest}`;
const validatedKey = `preview:validated:${artifact.manifest.artifactDigest}`;
const assetByPath = new Map(
  artifact.manifest.assets.map((entry) => [entry.urlPath, entry]),
);
const requestHeaderAllowlist = new Set([
  "accept",
  "accept-language",
  "cache-control",
  "content-type",
  "if-match",
  "if-modified-since",
  "if-none-match",
  "if-unmodified-since",
  "last-event-id",
  "origin",
  "pragma",
  "range",
  "referer",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
  "sec-fetch-user",
  "user-agent",
]);
const websocketRequestHeaders = new Set([
  "connection",
  "sec-websocket-extensions",
  "sec-websocket-key",
  "sec-websocket-protocol",
  "sec-websocket-version",
  "upgrade",
]);
const forbiddenResponseHeaders = new Set([
  "baggage",
  "clear-site-data",
  "connection",
  "content-security-policy",
  "content-security-policy-report-only",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "server-timing",
  "set-cookie",
  "sentry-trace",
  "te",
  "trailer",
  "traceparent",
  "tracestate",
  "transfer-encoding",
  "upgrade",
  "www-authenticate",
]);
const documentCsp =
  "sandbox allow-downloads allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-top-navigation-by-user-activation";

type PreviewOutboundProps = { mode: "serving" | "validation" };
type PreviewRuntimeBindings = {
  globalOutbound: Fetcher;
  tails: Fetcher[];
};
type PreviewRequestRecord = {
  body: ArrayBuffer | null;
  headers: [string, string][];
  method: string;
  redirect: RequestRedirect;
  url: string;
};

export class PreviewAssistantRpc extends WorkerEntrypoint<PreviewEnv> {
  artifacts(request: Request): Promise<Response> {
    return createFixtureArtifactsTransport(this.env.LOCAL_ARTIFACTS)(request);
  }
}

export class PreviewSiteOutbound extends WorkerEntrypoint<
  PreviewEnv,
  PreviewOutboundProps
> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === "artifacts.internal") {
      if (url.protocol !== "https:" || url.port !== "") {
        return Response.json(
          { error: "artifacts.internal requires HTTPS on the default port" },
          { status: 400 },
        );
      }
      if (
        this.ctx.props.mode === "validation" &&
        (request.method !== "GET" && request.method !== "HEAD")
      ) {
        return Response.json(
          { error: "site mutations are disabled during validation" },
          { status: 403 },
        );
      }
      const loopback = this.ctx.exports as unknown as {
        PreviewAssistantRpc: {
          artifacts(request: Request): Promise<Response>;
        };
      };
      return loopback.PreviewAssistantRpc.artifacts(request);
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return Response.json(
        { error: "unsupported outbound protocol" },
        { status: 400 },
      );
    }
    return fetch(request);
  }

  connect(): never {
    throw new Error("raw TCP is unsupported for agent sites");
  }
}

export class PreviewSiteTail extends WorkerEntrypoint<
  PreviewEnv,
  PreviewOutboundProps
> {
  tail(events: TraceItem[]): void {
    for (const event of events) {
      console.info("Local agent site execution", {
        mode: this.ctx.props.mode,
        outcome: event.outcome,
        cpuTime: event.cpuTime,
        wallTime: event.wallTime,
        logs: event.logs.length,
        exceptions: event.exceptions.length,
      });
    }
  }
}

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function asArrayBuffer(bytes: ArrayBuffer | ArrayBufferView): ArrayBuffer {
  if (bytes instanceof ArrayBuffer) return bytes;
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(
    new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength),
  );
  return copy.buffer;
}

async function sha256Hex(bytes: ArrayBuffer | ArrayBufferView) {
  const digest = await crypto.subtle.digest("SHA-256", asArrayBuffer(bytes));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function verified(
  bytes: ArrayBuffer | ArrayBufferView,
  size: number,
  expectedHash: string,
) {
  return bytes.byteLength === size && (await sha256Hex(bytes)) === expectedHash;
}

async function loadBlob(
  env: PreviewEnv,
  hash: string,
  size: number,
  fallback: ArrayBuffer | ArrayBufferView,
): Promise<ArrayBuffer> {
  const key = `site-blobs/v1/${hash}`;
  const stored = await env.SITE_BLOBS.get(key, "arrayBuffer");
  if (stored !== null && (await verified(stored, size, hash))) return stored;
  if (!(await verified(fallback, size, hash))) {
    throw new Error(`generated preview blob does not match ${hash}`);
  }
  const materialized = asArrayBuffer(fallback);
  await env.SITE_BLOBS.put(key, materialized);
  return materialized;
}

async function materialize(env: PreviewEnv) {
  if ((await env.SITE_BLOBS.get(materializedKey)) !== null) return;
  for (const entry of artifact.modules) {
    const manifestEntry = artifact.manifest.modules.find(
      (item) => item.moduleName === entry.moduleName,
    );
    if (manifestEntry === undefined) {
      throw new Error(`undeclared preview module ${entry.moduleName}`);
    }
    await loadBlob(
      env,
      manifestEntry.sha256,
      manifestEntry.size,
      new TextEncoder().encode(entry.text),
    );
  }
  for (const entry of artifact.assets) {
    await loadBlob(
      env,
      entry.sha256,
      entry.size,
      decodeBase64(entry.base64),
    );
  }
  await env.SITE_BLOBS.put(materializedKey, "1");
}

async function loadedWorker(
  env: PreviewEnv,
  mode: "serving" | "validation",
  bindings: PreviewRuntimeBindings,
) {
  return env.SITE_LOADER.get(
    `preview:${mode}:${artifact.manifest.artifactDigest}`,
    async () => {
      const modules: Record<string, WorkerLoaderModule | string> = {};
      for (const entry of artifact.manifest.modules) {
        const fixture = artifact.modules.find(
          (item) => item.moduleName === entry.moduleName,
        );
        if (fixture === undefined) {
          throw new Error(`missing generated preview module ${entry.moduleName}`);
        }
        const value = await loadBlob(
          env,
          entry.sha256,
          entry.size,
          new TextEncoder().encode(fixture.text),
        );
        const text = new TextDecoder().decode(value);
        if (entry.type === "js") {
          modules[entry.moduleName] = { js: text };
        } else if (entry.type === "text") {
          modules[entry.moduleName] = { text };
        } else {
          throw new Error(
            `unsupported generated preview module type ${entry.type}`,
          );
        }
      }
      return {
        compatibilityDate: artifact.manifest.compatibilityDate,
        compatibilityFlags: artifact.manifest.compatibilityFlags,
        mainModule: artifact.manifest.mainModule,
        modules,
        globalOutbound: bindings.globalOutbound,
        tails: bindings.tails,
      };
    },
  );
}

function mountedRequest(request: Request, mountPath: string) {
  const headers = new Headers(request.headers);
  headers.set(BASE_PATH_HEADER, mountPath);
  return new Request(request, { headers });
}

async function validate(
  request: Request,
  env: PreviewEnv,
  bindings: PreviewRuntimeBindings,
) {
  if ((await env.SITE_BLOBS.get(validatedKey)) !== null) return;
  const url = new URL(request.url);
  url.pathname = "/sites/local/";
  url.search = "";
  const worker = await loadedWorker(env, "validation", bindings);
  const response = await worker
    .getEntrypoint()
    .fetch(
      mountedRequest(
        new Request(url, { method: "GET", redirect: "manual" }),
        "/sites/local",
      ),
    );
  const status = response.status;
  await response.body?.cancel();
  if (status !== 200) {
    throw new Error(`platform preview validation returned HTTP ${status}`);
  }
  await env.SITE_BLOBS.put(validatedKey, "1");
}

function requestFromRecord(record: PreviewRequestRecord) {
  return new Request(record.url, {
    body: record.body,
    headers: record.headers,
    method: record.method,
    redirect: record.redirect,
  });
}

export class PreviewAgentServer extends DurableObject<PreviewEnv> {
  async serve(
    record: PreviewRequestRecord,
    mountPath: string,
    servingBindings: PreviewRuntimeBindings,
    validationBindings: PreviewRuntimeBindings,
  ): Promise<Response> {
    const request = requestFromRecord(record);
    const url = new URL(request.url);
    await materialize(this.env);
    await validate(request, this.env, validationBindings);
    const candidatePath = url.pathname.slice(mountPath.length) || "/";
    const asset = assetByPath.get(candidatePath);
    if (asset && (request.method === "GET" || request.method === "HEAD")) {
      const fixture = artifact.assets.find(
        (item) => item.urlPath === asset.urlPath,
      );
      if (fixture === undefined) {
        throw new Error(`missing generated preview asset ${asset.urlPath}`);
      }
      const bytes = await loadBlob(
        this.env,
        asset.sha256,
        asset.size,
        decodeBase64(fixture.base64),
      );
      return new Response(request.method === "HEAD" ? null : bytes, {
        headers: {
          "cache-control": candidatePath.startsWith("/assets/")
            ? "public, max-age=31536000, immutable"
            : "no-cache",
          "content-length": String(asset.size),
          "content-type": asset.contentType,
          etag: `"${asset.sha256}"`,
        },
      });
    }
    const worker = await loadedWorker(this.env, "serving", servingBindings);
    return worker
      .getEntrypoint()
      .fetch(mountedRequest(request, mountPath));
  }
}

function runtimeBindings(
  ctx: ExecutionContext,
  mode: "serving" | "validation",
): PreviewRuntimeBindings {
  const loopback = ctx.exports as unknown as {
    PreviewSiteOutbound(options: {
      props: PreviewOutboundProps;
    }): Fetcher;
    PreviewSiteTail(options: {
      props: PreviewOutboundProps;
    }): Fetcher;
  };
  return {
    globalOutbound: loopback.PreviewSiteOutbound({ props: { mode } }),
    tails: [loopback.PreviewSiteTail({ props: { mode } })],
  };
}

async function requestRecord(request: Request): Promise<PreviewRequestRecord> {
  const headers = new Headers();
  const websocket =
    request.headers.get("upgrade")?.toLowerCase() === "websocket";
  for (const [name, value] of request.headers) {
    const lower = name.toLowerCase();
    if (
      requestHeaderAllowlist.has(lower) ||
      (websocket && websocketRequestHeaders.has(lower))
    ) {
      headers.append(name, value);
    }
  }
  return {
    body:
      request.method === "GET" || request.method === "HEAD"
        ? null
        : await request.arrayBuffer(),
    headers: [...headers],
    method: request.method,
    redirect: request.redirect,
    url: request.url,
  };
}

function applyResponsePolicy(response: Response) {
  const headers = new Headers(response.headers);
  for (const name of [...headers.keys()]) {
    const lower = name.toLowerCase();
    if (
      forbiddenResponseHeaders.has(lower) ||
      lower.startsWith("x-convos-") ||
      lower.startsWith("cf-access-")
    ) {
      headers.delete(name);
    }
  }
  const contentType = headers.get("content-type")?.toLowerCase() ?? "";
  const isDocument =
    contentType.startsWith("text/html") ||
    contentType.startsWith("application/xhtml+xml");
  headers.delete("access-control-allow-credentials");
  headers.delete("access-control-allow-origin");
  if (isDocument) {
    headers.set("content-security-policy", documentCsp);
    headers.set("referrer-policy", "no-referrer");
    headers.set("x-content-type-options", "nosniff");
  } else if (response.status !== 101) {
    headers.set("access-control-allow-origin", "*");
    headers.set("x-content-type-options", "nosniff");
  }
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
    webSocket: response.webSocket,
  });
}

type ResolvedMount =
  | { kind: "redirect"; path: string }
  | { kind: "mount"; mountPath: string }
  | null;

function resolveMount(pathname: string): ResolvedMount {
  if (pathname === "/sites/local") {
    return { kind: "redirect", path: "/sites/local/" };
  }
  if (pathname.startsWith("/sites/local/")) {
    return { kind: "mount", mountPath: "/sites/local" };
  }
  const versionRoot = `/site-versions/local/${artifact.commitSha}`;
  if (pathname === versionRoot) {
    return { kind: "redirect", path: `${versionRoot}/` };
  }
  if (pathname.startsWith(`${versionRoot}/`)) {
    return { kind: "mount", mountPath: versionRoot };
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const resolved = resolveMount(url.pathname);
    if (resolved === null) {
      return Response.json({
        pinned: "/sites/local/",
        historical: `/site-versions/local/${artifact.commitSha}/`,
      });
    }
    let mountPath: string;
    if (resolved.kind === "redirect") {
      if (request.method === "GET" || request.method === "HEAD") {
        url.pathname = resolved.path;
        return Response.redirect(url, 308);
      }
      mountPath = resolved.path.slice(0, -1);
    } else {
      mountPath = resolved.mountPath;
    }
    const agentServer = env.AGENT_SERVER.getByName("local") as unknown as {
      serve(
        record: PreviewRequestRecord,
        path: string,
        servingBindings: PreviewRuntimeBindings,
        validationBindings: PreviewRuntimeBindings,
      ): Promise<Response>;
    };
    return applyResponsePolicy(
      await agentServer.serve(
        await requestRecord(request),
        mountPath,
        runtimeBindings(ctx, "serving"),
        runtimeBindings(ctx, "validation"),
      ),
    );
  },
} satisfies ExportedHandler<PreviewEnv>;
