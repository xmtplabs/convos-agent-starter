import {
  createRequestHandler,
  RouterContextProvider,
  type ServerBuild,
} from "react-router";
import {
  cloudflareContext,
  siteBasePathContext,
} from "@/lib/cloudflare";

const SITE_BASE_PATH_HEADER = "x-convos-site-base-path";
const SAFE_BASE_PATH =
  /^\/(?!.*(?:^|\/)\.{1,2}(?:\/|$))(?!.*\/\/)[^\0-\x1f\x7f\\?#]+$/;

function requestBasePath(request: Request): string {
  const candidate = request.headers.get(SITE_BASE_PATH_HEADER);
  if (candidate === null) return "/";
  if (
    candidate === "/" ||
    candidate.endsWith("/") ||
    !SAFE_BASE_PATH.test(candidate)
  ) {
    throw new Error("invalid site base path");
  }
  return candidate;
}

function mountRedirect(response: Response, basePath: string) {
  if (basePath === "/") return response;
  const location = response.headers.get("location");
  if (
    location === null ||
    !location.startsWith("/") ||
    location.startsWith("//") ||
    location === basePath ||
    location.startsWith(`${basePath}/`)
  ) {
    return response;
  }
  const headers = new Headers(response.headers);
  headers.set("location", `${basePath}${location}`);
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export default {
  async fetch(request, env, ctx) {
    let basePath: string;
    try {
      basePath = requestBasePath(request);
    } catch {
      return new Response("invalid site base path", { status: 400 });
    }
    const importedBuild = await import("virtual:react-router/server-build");
    const build = {
      ...importedBuild,
      basename: basePath,
    } as unknown as ServerBuild;
    const requestHandler = createRequestHandler(build, import.meta.env.MODE);
    const routerContext = new RouterContextProvider();
    routerContext.set(cloudflareContext, { env, ctx });
    routerContext.set(siteBasePathContext, basePath);
    return mountRedirect(
      await requestHandler(request, routerContext),
      basePath,
    );
  },
} satisfies ExportedHandler<Env>;
