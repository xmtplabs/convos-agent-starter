import type { ArtifactsTransport } from "./artifacts-api";
import type {
  ConversationSummary,
  ResolvedProfile,
  SiteEvent,
} from "./artifacts.types";

const encoder = new TextEncoder();
const MAX_TEXT_KEY_BYTES = 256;
const MAX_TEXT_VALUE_BYTES = 64 * 1024;
const MAX_EVENT_BYTES = 256 * 1024;
const MAX_EVENT_IDEMPOTENCY_KEY_BYTES = 128;

export const fixtureGroup: ConversationSummary = {
  conversation_id: "local-group",
  created_at: "2026-07-23T00:00:00.000Z",
  is_active: true,
  is_locked: false,
  kind: "group",
  member_count: 4,
  name: "Neighborhood Lab",
};

export const fixtureAgent: ResolvedProfile = {
  has_profile: true,
  image: null,
  inbox_id: "local-agent",
  is_me: true,
  member_kind: "agent",
  metadata: [{ name: "role", value: "group assistant" }],
  name: "Convos Agent",
  source: "app_data",
};

export const fixtureMembers: ResolvedProfile[] = [
  fixtureAgent,
  {
    has_profile: true,
    inbox_id: "mira",
    is_me: false,
    name: "Mira Chen",
    source: "app_data",
  },
  {
    has_profile: true,
    inbox_id: "sam",
    is_me: false,
    name: "Sam Rivera",
    source: "app_data",
  },
  {
    has_profile: true,
    inbox_id: "devon",
    is_me: false,
    name: "Devon Park",
    source: "app_data",
  },
];

const DEFAULT_TEXT = "Welcome. This space is ready for the group.";
const textKey = (key: string) => `text:${key}`;
const eventKey = (key: string) => `event:${key}`;
const json = (body: unknown, status = 200) =>
  Response.json(body, { status });
const byteLength = (value: string) => encoder.encode(value).byteLength;

async function parseObject(
  request: Request,
): Promise<
  | { ok: true; value: Record<string, unknown> }
  | { ok: false; response: Response }
> {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return {
      ok: false,
      response: json(
        { error: "content-type must be application/json" },
        415,
      ),
    };
  }
  try {
    const value: unknown = await request.json();
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return {
        ok: false,
        response: json({ error: "invalid request" }, 400),
      };
    }
    return { ok: true, value: value as Record<string, unknown> };
  } catch {
    return {
      ok: false,
      response: json({ error: "invalid JSON request" }, 400),
    };
  }
}

export function createFixtureArtifactsTransport(
  storage: KVNamespace,
): ArtifactsTransport {
  return async (input, init) => {
    const request = new Request(input, init);
    const url = new URL(request.url);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "artifacts.internal" ||
      url.port !== ""
    ) {
      return json({ error: "fixture transport only serves artifacts.internal" }, 400);
    }
    if (request.method === "GET" && url.pathname === "/v1/bootstrap") {
      return json({
        group: fixtureGroup,
        agent: fixtureAgent,
        members: fixtureMembers,
      });
    }
    if (request.method === "GET" && url.pathname === "/v1/group") {
      return json(fixtureGroup);
    }
    if (request.method === "GET" && url.pathname === "/v1/group/members") {
      return json(fixtureMembers);
    }
    if (request.method === "GET" && url.pathname === "/v1/agent") {
      return json(fixtureAgent);
    }
    const textMatch = /^\/v1\/text\/([^/]+)$/.exec(url.pathname);
    if (textMatch) {
      let key: string;
      try {
        key = decodeURIComponent(textMatch[1]);
      } catch {
        return json({ error: "invalid text key" }, 400);
      }
      if (byteLength(key) < 1 || byteLength(key) > MAX_TEXT_KEY_BYTES) {
        return json({ error: "invalid text key" }, 400);
      }
      if (request.method === "GET") {
        return json({
          value:
            (await storage.get(textKey(key))) ??
            (key === "welcome" ? DEFAULT_TEXT : null),
        });
      }
      if (request.method === "PUT") {
        const parsed = await parseObject(request);
        if (!parsed.ok) return parsed.response;
        if (
          Object.keys(parsed.value).length !== 1 ||
          typeof parsed.value.value !== "string"
        ) {
          return json({ error: "invalid request" }, 400);
        }
        if (byteLength(parsed.value.value) > MAX_TEXT_VALUE_BYTES) {
          return json({ error: "text value exceeds 65536 bytes" }, 400);
        }
        await storage.put(textKey(key), parsed.value.value);
        return json({ ok: true });
      }
    }
    if (request.method === "POST" && url.pathname === "/v1/agent/events") {
      if (
        !request.headers
          .get("content-type")
          ?.toLowerCase()
          .startsWith("application/json")
      ) {
        return json(
          { error: "content-type must be application/json" },
          415,
        );
      }
      const raw = await request.text();
      if (byteLength(raw) > MAX_EVENT_BYTES) {
        return json({ error: "event body exceeds 262144 bytes" }, 400);
      }
      let event: SiteEvent;
      try {
        event = JSON.parse(raw);
      } catch {
        return json({ error: "invalid JSON request" }, 400);
      }
      if (
        typeof event !== "object" ||
        event === null ||
        Object.keys(event).some(
          (key) => key !== "idempotencyKey" && key !== "body",
        ) ||
        typeof event.idempotencyKey !== "string" ||
        byteLength(event.idempotencyKey) < 1 ||
        byteLength(event.idempotencyKey) > MAX_EVENT_IDEMPOTENCY_KEY_BYTES ||
        typeof event.body !== "object" ||
        event.body === null ||
        Array.isArray(event.body)
      ) {
        return json({ error: "invalid request" }, 400);
      }
      const key = eventKey(event.idempotencyKey);
      const deduped = (await storage.get(key)) !== null;
      if (!deduped) {
        await storage.put(key, raw);
        console.info("Local artifacts inbox", {
          idempotencyKey: event.idempotencyKey,
          body: event.body,
        });
      }
      return json({ accepted: true, deduped }, 202);
    }
    return json({ error: "artifacts endpoint not found" }, 404);
  };
}
