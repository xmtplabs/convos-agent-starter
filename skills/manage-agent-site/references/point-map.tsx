/**
 * Copy this component into `src/components/point-map.tsx`. Supply a map image
 * with known bounds and calculate each point's percentages from those same
 * bounds. Never place approximate pins on a map that users may rely on.
 */
import { ExternalLinkIcon, MapPinIcon } from "lucide-react";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type PointOfReference = {
  id: string;
  label: string;
  description: string;
  address?: string;
  category?: string;
  href?: string;
  position: {
    xPercent: number;
    yPercent: number;
  };
};

export type PointMapData = {
  title: string;
  description?: string;
  mapImageUrl: string;
  mapAlt: string;
  points: PointOfReference[];
};

function boundedPercent(value: number) {
  return `${Math.min(100, Math.max(0, value))}%`;
}

export function PointMap({ map }: { map: PointMapData }) {
  const mapId = useId();
  return (
    <section aria-labelledby={`${mapId}-title`} className="space-y-5">
      <div>
        <h2
          id={`${mapId}-title`}
          className="text-2xl font-semibold tracking-tight"
        >
          {map.title}
        </h2>
        {map.description ? (
          <p className="mt-1 max-w-2xl text-muted-foreground">
            {map.description}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.5fr)]">
        <figure className="relative min-h-96 overflow-hidden rounded-xl border bg-muted shadow-sm">
          <img
            src={map.mapImageUrl}
            alt={map.mapAlt}
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5" aria-hidden="true" />

          {map.points.map((point, index) => (
            <a
              key={point.id}
              href={`#${mapId}-point-${index + 1}`}
              className="group absolute z-10 -translate-x-1/2 -translate-y-full rounded-full outline-none focus-visible:ring-4 focus-visible:ring-ring/50"
              style={{
                left: boundedPercent(point.position.xPercent),
                top: boundedPercent(point.position.yPercent),
              }}
              aria-label={`View ${point.label} details`}
            >
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-sm font-semibold text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                {index + 1}
              </span>
              <span
                className="mx-auto block h-2 w-0 border-x-4 border-t-8 border-x-transparent border-t-primary"
                aria-hidden="true"
              />
            </a>
          ))}

          <figcaption className="sr-only">
            {map.points.length} points of reference are shown and described
            beside the map.
          </figcaption>
        </figure>

        <ol className="space-y-3">
          {map.points.length === 0 ? (
            <li>
              <Card className="py-4">
                <CardContent className="px-4 text-sm text-muted-foreground">
                  No points of reference are available for this map.
                </CardContent>
              </Card>
            </li>
          ) : null}

          {map.points.map((point, index) => (
            <li key={point.id} id={`${mapId}-point-${index + 1}`}>
              <Card className="gap-4 py-4 transition-colors target:border-primary">
                <CardHeader className="grid-cols-[auto_1fr] items-start gap-x-3 px-4">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle>{point.label}</CardTitle>
                      {point.category ? (
                        <Badge variant="secondary">{point.category}</Badge>
                      ) : null}
                    </div>
                    {point.address ? (
                      <CardDescription className="mt-1 flex items-start gap-1.5">
                        <MapPinIcon
                          className="mt-0.5 size-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        {point.address}
                      </CardDescription>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="px-4 pl-15">
                  <p className="text-sm text-muted-foreground">
                    {point.description}
                  </p>
                  {point.href ? (
                    <a
                      href={point.href}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      View details
                      <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
