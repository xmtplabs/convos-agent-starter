import {
  Form,
  Link,
  data,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from "react-router";
import { SendIcon, SparklesIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getArtifactsClient } from "@/lib/artifacts.server";
import type { ResolvedProfile } from "@/lib/artifacts.types";
import type { loader as rootLoader } from "@/root";
import type { Route } from "./+types/home";

const TEXT_KEY = "welcome";

function profileName(profile: ResolvedProfile) {
  return profile.name?.trim() || `Member ${profile.inbox_id.slice(0, 8)}`;
}

function initials(value: string) {
  const result = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return result || "?";
}

export async function loader({ context }: Route.LoaderArgs) {
  const client = await getArtifactsClient(context);
  const text = await client.getText(TEXT_KEY);
  return data({
    text: text.value ?? "",
    eventIdempotencyKey: crypto.randomUUID(),
  });
}

export async function action({ context, request }: Route.ActionArgs) {
  const form = await request.formData();
  const intent = form.get("intent");
  const client = await getArtifactsClient(context);
  if (intent === "save-text") {
    const value = form.get("value");
    if (typeof value !== "string") {
      return data({ ok: false as const, message: "Enter a text value." }, 400);
    }
    await client.setText(TEXT_KEY, value);
    return data({ ok: true as const, message: "Saved for this group." });
  }
  if (intent === "send-event") {
    const message = form.get("message");
    const idempotencyKey = form.get("idempotency_key");
    if (
      typeof message !== "string" ||
      !message.trim() ||
      typeof idempotencyKey !== "string" ||
      !idempotencyKey
    ) {
      return data(
        { ok: false as const, message: "Write a message before sending." },
        400,
      );
    }
    const result = await client.sendToAgent({
      idempotencyKey,
      body: { message: message.trim(), source: "starter-welcome-page" },
    });
    return data({
      ok: true as const,
      message: result.deduped
        ? "That event was already accepted."
        : "Event queued for the assistant.",
    });
  }
  return data({ ok: false as const, message: "Unknown form action." }, 400);
}

export function HydrateFallback() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <Skeleton className="h-12 w-44" />
      <Skeleton className="mt-12 h-72 w-full" />
    </main>
  );
}

export default function Home() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  if (rootData === undefined) {
    throw new Error("root site data is unavailable");
  }
  const { group, agent, members } = rootData;
  const { text, eventIdempotencyKey } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const pendingIntent = navigation.formData?.get("intent");
  const agentName = profileName(agent);
  return (
    <main className="min-h-[100dvh] bg-background">
      <header className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="font-semibold tracking-tight">
          Convos
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/about"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          <Badge variant="secondary">
            {group.is_active ? "Group space active" : "Group space inactive"}
          </Badge>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 pt-8 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-xl border bg-card p-7 text-card-foreground shadow-sm sm:p-10">
          <div className="flex items-start gap-4">
            <Avatar className="size-14 rounded-xl">
              <AvatarFallback className="rounded-xl bg-accent text-accent-foreground">
                {initials(group.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Your shared space
              </p>
              <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
                {group.name}
              </h1>
            </div>
          </div>
          <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
            A focused home for the people and work in this conversation.
          </p>
          <dl className="mt-10 grid gap-5 border-t pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Members</dt>
              <dd className="mt-1 text-2xl font-semibold">
                {group.member_count}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Conversation ID</dt>
              <dd className="mt-1 truncate font-mono text-sm">
                {group.conversation_id}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Kind</dt>
              <dd className="mt-1 font-medium capitalize">{group.kind}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Created</dt>
              <dd className="mt-1 font-medium">
                <time dateTime={group.created_at}>
                  {group.created_at.slice(0, 10)}
                </time>
              </dd>
            </div>
          </dl>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Your assistant</CardTitle>
            <CardDescription>
              Available to help this group move work forward.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src={agent.image ?? undefined} alt={agentName} />
                <AvatarFallback>{initials(agentName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-semibold">{agentName}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {agent.member_kind === "agent"
                    ? "Group assistant"
                    : agent.inbox_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="mb-5">
          <h2 className="text-xl font-semibold tracking-tight">
            People in this group
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Live member profiles from this conversation.
          </p>
        </div>
        <Card className="py-0">
          <Table>
            <TableCaption className="sr-only">
              Current conversation member profiles
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead className="hidden md:table-cell">Inbox ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => {
                const name = profileName(member);
                return (
                  <TableRow key={member.inbox_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={member.image ?? undefined}
                            alt={name}
                          />
                          <AvatarFallback>{initials(name)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {member.member_kind === "agent" ? "Agent" : "Member"}
                    </TableCell>
                    <TableCell className="hidden max-w-64 truncate font-mono text-xs text-muted-foreground md:table-cell">
                      {member.inbox_id}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Persistent group text</CardTitle>
            <CardDescription>
              This value is stored by the assistant-scoped artifacts API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="save-text" />
              <div className="space-y-2">
                <Label htmlFor="persistent-value">Welcome note</Label>
                <Input
                  id="persistent-value"
                  name="value"
                  defaultValue={text}
                  maxLength={65_536}
                />
              </div>
              <Button
                type="submit"
                disabled={
                  navigation.state !== "idle" && pendingIntent === "save-text"
                }
              >
                {pendingIntent === "save-text" ? "Saving…" : "Save text"}
              </Button>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send an assistant event</CardTitle>
            <CardDescription>
              Events enter the same durable turn pipeline as other messages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-4">
              <input type="hidden" name="intent" value="send-event" />
              <input
                type="hidden"
                name="idempotency_key"
                value={eventIdempotencyKey}
              />
              <div className="space-y-2">
                <Label htmlFor="event-message">Message</Label>
                <Textarea
                  id="event-message"
                  name="message"
                  placeholder="Ask the assistant to follow up…"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={
                  navigation.state !== "idle" && pendingIntent === "send-event"
                }
              >
                {pendingIntent === "send-event" ? (
                  "Sending…"
                ) : (
                  <>
                    <SendIcon />
                    Send event
                  </>
                )}
              </Button>
            </Form>
          </CardContent>
        </Card>

        {actionData ? (
          <Alert
            variant={actionData.ok ? "default" : "destructive"}
            className="lg:col-span-2"
          >
            <SparklesIcon />
            <AlertTitle>{actionData.ok ? "Done" : "Could not submit"}</AlertTitle>
            <AlertDescription>{actionData.message}</AlertDescription>
          </Alert>
        ) : null}
      </section>
    </main>
  );
}
