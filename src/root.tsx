import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import { siteBasePathContext } from "@/lib/cloudflare";
import { getArtifactsClient } from "@/lib/artifacts.server";
import "./styles/globals.css";

export async function loader({ context }: Route.LoaderArgs) {
  const client = await getArtifactsClient(context);
  const [group, agent, members] = await Promise.all([
    client.groupInfo(),
    client.agentInfo(),
    client.groupMembers(),
  ]);
  return {
    basePath: context.get(siteBasePathContext),
    group,
    agent,
    members,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");
  const baseHref =
    data?.basePath === "/" ? "/" : `${data?.basePath ?? ""}/`;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base href={baseHref} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "The site could not render this page";
  const message = isRouteErrorResponse(error)
    ? typeof error.data === "string"
      ? error.data
      : "The requested route returned an error."
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-2xl items-center px-6 py-16">
      <div>
        <p className="text-sm font-medium text-destructive">Site error</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-4 text-muted-foreground">{message}</p>
        <a
          href="."
          className="mt-8 inline-flex text-sm font-medium text-primary underline underline-offset-4"
        >
          Return to the site
        </a>
      </div>
    </main>
  );
}
