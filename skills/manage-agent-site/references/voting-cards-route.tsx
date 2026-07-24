/**
 * Copy this complete route into `src/routes/choices.tsx`, add it to
 * `src/routes.ts`, and replace the sample choices. The action delivers each
 * vote to the agent as a site event; the browser never calls
 * `artifacts.internal` directly.
 *
 * This is lightweight group feedback, not an authenticated election. Public
 * requests do not carry a durable voter identity, so one person can vote more
 * than once by reloading the page.
 */
import {
  Form,
  data,
  useActionData,
  useLoaderData,
  useNavigation,
  type ActionFunctionArgs,
} from "react-router";
import { CheckCircle2Icon, SendIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getArtifactsClient } from "@/lib/artifacts.server";

const choices = [
  {
    id: "rooftop-movie",
    eyebrow: "Relaxed",
    title: "Rooftop movie night",
    description:
      "A sunset screening with snacks, blankets, and a group-picked film.",
    visual: "🎬",
    visualLabel: "Movie clapper board",
    accentClass: "from-violet-500/30 via-fuchsia-400/20 to-amber-300/30",
  },
  {
    id: "tasting-menu",
    eyebrow: "Food",
    title: "Neighborhood tasting menu",
    description:
      "A progressive dinner with one course at each of three local spots.",
    visual: "🍽️",
    visualLabel: "Place setting",
    accentClass: "from-rose-500/30 via-orange-400/20 to-yellow-300/30",
  },
  {
    id: "coastal-hike",
    eyebrow: "Active",
    title: "Coastal day hike",
    description:
      "A moderate trail, a picnic overlook, and time by the water.",
    visual: "🥾",
    visualLabel: "Hiking boot",
    accentClass: "from-emerald-500/30 via-cyan-400/20 to-blue-300/30",
  },
] as const;

export function loader() {
  return data({ voteToken: crypto.randomUUID() });
}

export async function action({ context, request }: ActionFunctionArgs) {
  const form = await request.formData();
  const choiceId = form.get("choice_id");
  const voteToken = form.get("vote_token");
  const choice =
    typeof choiceId === "string"
      ? choices.find((candidate) => candidate.id === choiceId)
      : undefined;

  if (
    !choice ||
    typeof voteToken !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      voteToken,
    )
  ) {
    return data(
      { ok: false as const, message: "That voting option is invalid." },
      400,
    );
  }

  const client = await getArtifactsClient(context);
  const result = await client.sendToAgent({
    idempotencyKey: `site-vote:${voteToken}:${choice.id}`,
    body: {
      type: "card-vote",
      source: "website-choice-cards",
      message: `A website visitor voted for "${choice.title}".`,
      choice: { id: choice.id, title: choice.title },
    },
  });

  return data({
    ok: true as const,
    message: result.deduped
      ? `Your vote for ${choice.title} was already received.`
      : `Your vote for ${choice.title} was sent to the agent.`,
  });
}

export default function ChoiceCardsRoute() {
  const { voteToken } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const pendingChoice = navigation.formData?.get("choice_id");

  return (
    <main className="mx-auto min-h-[100dvh] max-w-6xl px-6 py-12">
      <div className="max-w-2xl">
        <Badge variant="secondary">Group vote</Badge>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          What should we do together?
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Pick one option. Your selection is sent as a message to the agent so
          it can help the group decide what happens next.
        </p>
      </div>

      {actionData ? (
        <Alert
          variant={actionData.ok ? "default" : "destructive"}
          className="mt-8"
        >
          {actionData.ok ? (
            <CheckCircle2Icon aria-hidden="true" />
          ) : (
            <SendIcon aria-hidden="true" />
          )}
          <AlertTitle>{actionData.ok ? "Vote received" : "Try again"}</AlertTitle>
          <AlertDescription>{actionData.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {choices.map((choice) => {
          const isPending =
            navigation.state !== "idle" && pendingChoice === choice.id;
          return (
            <Card key={choice.id} className="overflow-hidden py-0">
              <div
                className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${choice.accentClass}`}
                role="img"
                aria-label={choice.visualLabel}
              >
                <span className="text-6xl drop-shadow-sm" aria-hidden="true">
                  {choice.visual}
                </span>
              </div>
              <CardHeader>
                <CardDescription>{choice.eyebrow}</CardDescription>
                <CardTitle className="text-xl">{choice.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {choice.description}
                </p>
              </CardContent>
              <CardFooter className="pb-6">
                <Form method="post" className="w-full">
                  <input type="hidden" name="choice_id" value={choice.id} />
                  <input type="hidden" name="vote_token" value={voteToken} />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={navigation.state !== "idle"}
                  >
                    <SendIcon aria-hidden="true" />
                    {isPending ? "Sending vote…" : `Vote for ${choice.title}`}
                  </Button>
                </Form>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
