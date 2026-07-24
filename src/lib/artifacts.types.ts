export type ConversationSummary = {
  conversation_id: string;
  created_at: string;
  is_active: boolean;
  is_locked: boolean;
  kind: "group" | "dm";
  member_count: number;
  name: string;
};

export type ProfileMetadataField = {
  name: string;
  value: string | number | boolean;
};

export type ResolvedProfile = {
  has_profile: boolean;
  image?: string | null;
  inbox_id: string;
  is_me: boolean;
  member_kind?: "unspecified" | "agent";
  metadata?: ProfileMetadataField[];
  name?: string | null;
  source?: "message" | "app_data";
};

export type Bootstrap = {
  group: ConversationSummary;
  agent: ResolvedProfile;
  members: ResolvedProfile[];
};

export type SiteEvent = {
  idempotencyKey: string;
  body: Record<string, unknown>;
};

export type ArtifactsClient = {
  bootstrap(): Promise<Bootstrap>;
  groupInfo(): Promise<ConversationSummary>;
  groupMembers(): Promise<ResolvedProfile[]>;
  agentInfo(): Promise<ResolvedProfile>;
  getText(key: string): Promise<{ value: string | null }>;
  setText(key: string, value: string): Promise<{ ok: true }>;
  sendToAgent(
    event: SiteEvent,
  ): Promise<{ accepted: true; deduped: boolean }>;
};
