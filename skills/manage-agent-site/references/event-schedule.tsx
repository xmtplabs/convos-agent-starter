/**
 * Copy this component into `src/components/event-schedule.tsx`. Supply exact
 * ISO timestamps and already-formatted local labels from a loader. Keep the
 * event timezone visible; never infer it in the browser.
 */
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  RadioIcon,
} from "lucide-react";
import { useId } from "react";
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
import { cn } from "@/lib/utils";

export type ScheduleSpeaker = {
  id: string;
  name: string;
  imageUrl?: string;
};

export type ScheduleSession = {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  startLabel: string;
  endLabel: string;
  location?: string;
  track?: string;
  status?: "upcoming" | "live" | "complete" | "cancelled";
  speakers?: ScheduleSpeaker[];
  href?: string;
};

export type ScheduleDay = {
  id: string;
  dateTime: string;
  weekdayLabel: string;
  dateLabel: string;
  sessions: ScheduleSession[];
};

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function StatusBadge({ status }: { status: ScheduleSession["status"] }) {
  if (!status || status === "upcoming") return null;
  const label = {
    live: "Live now",
    complete: "Complete",
    cancelled: "Cancelled",
  }[status];
  return (
    <Badge variant={status === "cancelled" ? "destructive" : "secondary"}>
      {status === "live" ? <RadioIcon aria-hidden="true" /> : null}
      {label}
    </Badge>
  );
}

export function EventSchedule({
  title,
  timezoneLabel,
  days,
}: {
  title: string;
  timezoneLabel: string;
  days: ScheduleDay[];
}) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="space-y-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <CalendarDaysIcon className="size-4" aria-hidden="true" />
            Event schedule
          </p>
          <h2
            id={titleId}
            className="mt-1 text-3xl font-semibold tracking-tight"
          >
            {title}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Times shown in {timezoneLabel}
        </p>
      </div>

      {days.length === 0 ? (
        <Card>
          <CardContent className="text-sm text-muted-foreground">
            No sessions have been scheduled yet.
          </CardContent>
        </Card>
      ) : null}

      {days.map((day, dayIndex) => (
        <section
          key={day.id}
          aria-labelledby={`${titleId}-day-${dayIndex + 1}`}
          className="grid gap-4 lg:grid-cols-[10rem_1fr]"
        >
          <div className="lg:sticky lg:top-6 lg:self-start">
            <p className="text-sm font-medium text-muted-foreground">
              {day.weekdayLabel}
            </p>
            <h3
              id={`${titleId}-day-${dayIndex + 1}`}
              className="mt-1 text-xl font-semibold"
            >
              <time dateTime={day.dateTime}>{day.dateLabel}</time>
            </h3>
          </div>

          {day.sessions.length === 0 ? (
            <Card>
              <CardContent className="text-sm text-muted-foreground">
                Nothing is scheduled for this day.
              </CardContent>
            </Card>
          ) : (
            <ol className="space-y-3">
              {day.sessions.map((session) => (
                <li key={session.id}>
                  <Card
                    className={
                      session.status === "cancelled" ? "opacity-70" : undefined
                    }
                  >
                    <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          {session.track ? (
                            <Badge variant="outline">{session.track}</Badge>
                          ) : null}
                          <StatusBadge status={session.status} />
                        </div>
                        <CardTitle className="mt-3 text-xl">
                          {session.title}
                        </CardTitle>
                        {session.description ? (
                          <CardDescription className="mt-2 max-w-2xl leading-6">
                            {session.description}
                          </CardDescription>
                        ) : null}
                      </div>

                      <div className="text-sm sm:text-right">
                        <p className="flex items-center gap-1.5 font-medium sm:justify-end">
                          <ClockIcon className="size-4" aria-hidden="true" />
                          <time dateTime={session.startDateTime}>
                            {session.startLabel}
                          </time>
                          <span aria-hidden="true">–</span>
                          <time dateTime={session.endDateTime}>
                            {session.endLabel}
                          </time>
                        </p>
                        {session.location ? (
                          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground sm:justify-end">
                            <MapPinIcon className="size-4" aria-hidden="true" />
                            {session.location}
                          </p>
                        ) : null}
                      </div>
                    </CardHeader>

                    {session.speakers?.length || session.href ? (
                      <CardContent
                        className={cn(
                          "flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center",
                          !session.speakers?.length && "sm:justify-end",
                        )}
                      >
                        {session.speakers?.length ? (
                          <ul
                            className="flex flex-wrap gap-3"
                            aria-label="Speakers"
                          >
                            {session.speakers.map((speaker) => (
                              <li
                                key={speaker.id}
                                className="flex items-center gap-2 text-sm"
                              >
                                <Avatar size="sm">
                                  {speaker.imageUrl ? (
                                    <AvatarImage
                                      src={speaker.imageUrl}
                                      alt=""
                                    />
                                  ) : null}
                                  <AvatarFallback>
                                    {initials(speaker.name)}
                                  </AvatarFallback>
                                </Avatar>
                                {speaker.name}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {session.href ? (
                          <Button asChild variant="outline" size="sm">
                            <a href={session.href}>Session details</a>
                          </Button>
                        ) : null}
                      </CardContent>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </section>
  );
}
