/**
 * Copy this component into `src/components/flight-details.tsx`. Supply display
 * labels plus machine-readable ISO timestamps from a loader so every airport's
 * local date, time, and timezone remain explicit.
 */
import {
  ClockIcon,
  LuggageIcon,
  PlaneIcon,
  PlaneLandingIcon,
  PlaneTakeoffIcon,
} from "lucide-react";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type FlightEndpoint = {
  airportCode: string;
  airportName: string;
  city: string;
  dateLabel: string;
  timeLabel: string;
  dateTime: string;
  timezoneLabel: string;
  terminal?: string;
  gate?: string;
};

export type FlightDetailsData = {
  airline: string;
  flightNumber: string;
  status: "on-time" | "delayed" | "boarding" | "cancelled" | "landed";
  statusLabel: string;
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  duration: string;
  aircraft?: string;
  cabin?: string;
  baggageClaim?: string;
};

function statusVariant(status: FlightDetailsData["status"]) {
  if (status === "cancelled") return "destructive" as const;
  if (status === "on-time" || status === "landed") return "default" as const;
  return "secondary" as const;
}

function Endpoint({
  endpoint,
  kind,
}: {
  endpoint: FlightEndpoint;
  kind: "departure" | "arrival";
}) {
  const Icon = kind === "departure" ? PlaneTakeoffIcon : PlaneLandingIcon;
  return (
    <div className={kind === "arrival" ? "text-right" : undefined}>
      <p
        className={`flex items-center gap-1.5 text-sm font-medium text-muted-foreground ${
          kind === "arrival" ? "justify-end" : ""
        }`}
      >
        <Icon className="size-4" aria-hidden="true" />
        {kind === "departure" ? "Departs" : "Arrives"}
      </p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">
        <time dateTime={endpoint.dateTime}>{endpoint.timeLabel}</time>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {endpoint.dateLabel} · {endpoint.timezoneLabel}
      </p>
      <p className="mt-4 text-2xl font-semibold">{endpoint.airportCode}</p>
      <p className="text-sm">{endpoint.city}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {endpoint.airportName}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

export function FlightDetails({ flight }: { flight: FlightDetailsData }) {
  const titleId = useId();
  return (
    <Card aria-labelledby={titleId} className="overflow-hidden">
      <CardHeader className="gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <CardDescription>{flight.airline}</CardDescription>
          <CardTitle id={titleId} className="mt-1 text-2xl">
            Flight {flight.flightNumber}
          </CardTitle>
        </div>
        <Badge
          variant={statusVariant(flight.status)}
          className="sm:justify-self-end"
        >
          {flight.statusLabel}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-7">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Endpoint endpoint={flight.departure} kind="departure" />
          <div className="flex min-w-20 flex-col items-center gap-2 text-muted-foreground">
            <span className="inline-flex items-center gap-1 text-xs">
              <ClockIcon className="size-3.5" aria-hidden="true" />
              {flight.duration}
            </span>
            <div className="flex w-full items-center">
              <span className="size-2 rounded-full bg-border" />
              <span className="h-px flex-1 bg-border" />
              <PlaneIcon className="size-5 rotate-45" aria-hidden="true" />
              <span className="h-px flex-1 bg-border" />
              <span className="size-2 rounded-full bg-border" />
            </div>
            <span className="text-xs">Nonstop</span>
          </div>
          <Endpoint endpoint={flight.arrival} kind="arrival" />
        </div>

        <Separator />

        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Detail
            label="Departure"
            value={[
              flight.departure.terminal
                ? `Terminal ${flight.departure.terminal}`
                : undefined,
              flight.departure.gate
                ? `Gate ${flight.departure.gate}`
                : undefined,
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <Detail
            label="Arrival"
            value={[
              flight.arrival.terminal
                ? `Terminal ${flight.arrival.terminal}`
                : undefined,
              flight.arrival.gate ? `Gate ${flight.arrival.gate}` : undefined,
            ]
              .filter(Boolean)
              .join(" · ")}
          />
          <Detail label="Aircraft" value={flight.aircraft} />
          <Detail label="Cabin" value={flight.cabin} />
        </dl>

        {flight.baggageClaim ? (
          <p className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm">
            <LuggageIcon className="size-4" aria-hidden="true" />
            Baggage claim: <strong>{flight.baggageClaim}</strong>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
