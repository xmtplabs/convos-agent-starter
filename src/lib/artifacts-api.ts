import type {
  ArtifactsClient,
  Bootstrap,
  ConversationSummary,
  ResolvedProfile,
  SiteEvent,
} from "./artifacts.types";

export type ArtifactsTransport = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export class ArtifactsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ArtifactsError";
  }
}

async function readJson<T>(
  transport: ArtifactsTransport,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await transport(`https://artifacts.internal/v1${path}`, init);
  if (!response.ok) {
    throw new ArtifactsError(
      `artifacts request ${path} failed (${response.status})`,
      response.status,
    );
  }
  const contentType = response.headers.get("content-type")?.toLowerCase();
  if (!contentType?.startsWith("application/json")) {
    throw new ArtifactsError(
      `artifacts request ${path} returned non-JSON`,
      response.status,
    );
  }
  return response.json() as Promise<T>;
}

export function createArtifactsClient(
  transport: ArtifactsTransport,
): ArtifactsClient {
  return {
    bootstrap: () => readJson<Bootstrap>(transport, "/bootstrap"),
    groupInfo: () => readJson<ConversationSummary>(transport, "/group"),
    groupMembers: () =>
      readJson<ResolvedProfile[]>(transport, "/group/members"),
    agentInfo: () => readJson<ResolvedProfile>(transport, "/agent"),
    getText: (key) =>
      readJson<{ value: string | null }>(
        transport,
        `/text/${encodeURIComponent(key)}`,
      ),
    setText: (key, value) =>
      readJson<{ ok: true }>(
        transport,
        `/text/${encodeURIComponent(key)}`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ value }),
        },
      ),
    sendToAgent: (event: SiteEvent) =>
      readJson<{ accepted: true; deduped: boolean }>(
        transport,
        "/agent/events",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(event),
        },
      ),
  };
}

export type { ArtifactsClient } from "./artifacts.types";
