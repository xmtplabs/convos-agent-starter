/**
 * Copy this component into `src/components/timeline.tsx`. Keep milestones in
 * chronological display order and supply machine-readable dates whenever an
 * item represents a real point in time.
 */
import {
  ArrowRightIcon,
  BanIcon,
  CheckIcon,
  CircleDotIcon,
  CircleIcon,
} from "lucide-react";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TimelineItem = {
  id: string;
  title: string;
  description: string;
  dateLabel?: string;
  dateTime?: string;
  status: "complete" | "current" | "upcoming" | "blocked";
  category?: string;
  href?: string;
  linkLabel?: string;
};

const statusLabel: Record<TimelineItem["status"], string> = {
  complete: "Complete",
  current: "In progress",
  upcoming: "Upcoming",
  blocked: "Blocked",
};

function Marker({ status }: { status: TimelineItem["status"] }) {
  const Icon = {
    complete: CheckIcon,
    current: CircleDotIcon,
    upcoming: CircleIcon,
    blocked: BanIcon,
  }[status];
  return (
    <span
      className={cn(
        "relative z-10 flex size-9 items-center justify-center rounded-full border-2 bg-background",
        status === "complete" && "border-primary bg-primary text-primary-foreground",
        status === "current" && "border-primary text-primary",
        status === "upcoming" && "border-border text-muted-foreground",
        status === "blocked" && "border-destructive text-destructive",
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span className="sr-only">{statusLabel[status]}</span>
    </span>
  );
}

export function Timeline({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: TimelineItem[];
}) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId}>
      <h2 id={titleId} className="text-3xl font-semibold tracking-tight">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
          No timeline entries are available.
        </div>
      ) : (
        <ol className="mt-8">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="relative grid grid-cols-[2.25rem_1fr] gap-4 pb-8 last:pb-0"
            >
              {index < items.length - 1 ? (
                <span
                  className="absolute bottom-0 left-[1.0625rem] top-9 w-px bg-border"
                  aria-hidden="true"
                />
              ) : null}
              <Marker status={item.status} />

              <article className="min-w-0 rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.category ? (
                        <Badge variant="outline">{item.category}</Badge>
                      ) : null}
                      <Badge
                        variant={
                          item.status === "blocked"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {statusLabel[item.status]}
                      </Badge>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  </div>

                  {item.dateLabel ? (
                    item.dateTime ? (
                      <time
                        dateTime={item.dateTime}
                        className="shrink-0 text-sm text-muted-foreground"
                      >
                        {item.dateLabel}
                      </time>
                    ) : (
                      <span className="shrink-0 text-sm text-muted-foreground">
                        {item.dateLabel}
                      </span>
                    )
                  ) : null}
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>

                {item.href ? (
                  <Button asChild variant="link" className="mt-3 h-auto p-0">
                    <a href={item.href}>
                      {item.linkLabel ?? "View details"}
                      <ArrowRightIcon aria-hidden="true" />
                    </a>
                  </Button>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
