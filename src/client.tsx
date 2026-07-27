import { Renderer } from "@openuidev/react-lang";
import { createRoot } from "react-dom/client";
import { library } from "./library.js";
import { toolNames } from "./tools.js";
import { useOpenUiPage } from "./use-openui-page.js";

export type ShellMetadata = {
  route: string;
  bundleDigest: string;
  historical: boolean;
};

const BUNDLE_DIGEST = /^[a-f0-9]{64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readShellMetadata(page = document): ShellMetadata {
  const element = page.getElementById("convos-site");
  if (
    !(element instanceof HTMLScriptElement) ||
    element.type !== "application/json"
  ) {
    throw new Error("The site shell is missing its metadata.");
  }
  let value: unknown;
  try {
    value = JSON.parse(element.textContent ?? "");
  } catch {
    throw new Error("The site shell metadata is invalid.");
  }
  if (
    !isRecord(value) ||
    Object.keys(value).sort().join(",") !==
      "bundleDigest,historical,route" ||
    typeof value.route !== "string" ||
    !value.route.startsWith("/") ||
    typeof value.bundleDigest !== "string" ||
    !BUNDLE_DIGEST.test(value.bundleDigest) ||
    typeof value.historical !== "boolean"
  ) {
    throw new Error("The site shell metadata is invalid.");
  }
  return {
    route: value.route,
    bundleDigest: value.bundleDigest,
    historical: value.historical,
  };
}

function PageLoading() {
  return (
    <main className="state" aria-live="polite">
      Loading page…
    </main>
  );
}

function PageError({ error }: { error: string | null }) {
  return (
    <main className="state state--error" role="alert" aria-live="assertive">
      <h1>This page could not load</h1>
      <p>{error ?? "Please try again."}</p>
    </main>
  );
}

function StaleContentNotice() {
  return (
    <p className="notice" role="status">
      Showing the last available version while we reconnect.
    </p>
  );
}

export async function callPublicTool(
  name: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const response = await fetch("__convos/tools", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, arguments: args }),
  });
  if (!response.ok) throw new Error("This page operation is unavailable.");
  return response.json();
}

export const browserToolProvider: Record<
  string,
  (args: Record<string, unknown>) => Promise<unknown>
> = Object.fromEntries(
  toolNames.map((name) => [
    name,
    (args: Record<string, unknown>) => callPublicTool(name, args),
  ]),
);

export function OpenUiRenderer({ source }: { source: string }) {
  return (
    <Renderer
      response={source}
      library={library}
      isStreaming={false}
      toolProvider={browserToolProvider}
    />
  );
}

export function SitePage({
  route,
  bundleDigest,
  historical,
}: ShellMetadata) {
  const page = useOpenUiPage({
    route,
    expectedBundleDigest: bundleDigest,
    historical,
  });
  if (!bundleDigest) {
    return <PageError error="The site shell is missing its bundle identity." />;
  }
  if (page.status === "loading") return <PageLoading />;
  if (page.status === "error") return <PageError error={page.error} />;
  return (
    <>
      {page.stale ? <StaleContentNotice /> : null}
      <OpenUiRenderer source={page.source!} />
    </>
  );
}

if (typeof document !== "undefined") {
  const mount = document.getElementById("root");
  if (!mount) throw new Error("The site shell is missing its React mount.");
  createRoot(mount).render(<SitePage {...readShellMetadata()} />);
}
