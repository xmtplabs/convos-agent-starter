import type { ToolOperation } from "./tools.js";

export type FixtureTool = {
  operation: ToolOperation;
  execute: (
    input: Record<string, unknown>,
    signal: AbortSignal,
  ) => Promise<unknown>;
};

export const fixtureGroup = {
  conversation_id: "local-group",
  created_at: "2026-07-24T00:00:00.000Z",
  is_active: true,
  kind: "group" as const,
  member_count: 4,
  name: "Neighborhood Lab",
};

export const fixtureMembers = [
  { inbox_id: "local-agent", member_kind: "agent" as const, name: "Webmaster" },
  { inbox_id: "mira", member_kind: "member" as const, name: "Mira Chen" },
  { inbox_id: "sam", member_kind: "member" as const, name: "Sam Rivera" },
  { inbox_id: "devon", member_kind: "member" as const, name: "Devon Park" },
];

/** Fixture-backed executors used only by the local static renderer. */
export const fixtureTools: Record<string, FixtureTool> = {
  get_group: {
    operation: "query",
    async execute(_input: Record<string, unknown>, _signal: AbortSignal) {
      return fixtureGroup;
    },
  },
  get_members: {
    operation: "query",
    async execute(_input: Record<string, unknown>, _signal: AbortSignal) {
      return fixtureMembers;
    },
  },
  send_to_agent: {
    operation: "mutation",
    async execute(input: Record<string, unknown>, _signal: AbortSignal) {
      return {
        accepted: true,
        deduped: input.idempotencyKey === "fixture-duplicate",
      };
    },
  },
};
