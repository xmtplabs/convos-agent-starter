import type { RouterContextProvider } from "react-router";
import { createArtifactsClient } from "./artifacts-api";
import type { ArtifactsClient } from "./artifacts.types";
import { cloudflareContext } from "./cloudflare";

export async function getArtifactsClient(
  context: Readonly<RouterContextProvider>,
): Promise<ArtifactsClient> {
  const { env } = context.get(cloudflareContext);
  if (import.meta.env.DEV && env.LOCAL_ARTIFACTS !== undefined) {
    const { createFixtureArtifactsTransport } = await import(
      "./artifacts.fixtures"
    );
    return createArtifactsClient(
      createFixtureArtifactsTransport(env.LOCAL_ARTIFACTS),
    );
  }
  return createArtifactsClient(fetch);
}
