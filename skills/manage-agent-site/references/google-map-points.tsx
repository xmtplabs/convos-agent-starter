/**
 * Copy this component into `src/components/google-map-points.tsx`. It uses the
 * committed, domain-restricted browser key in `src/lib/google-maps-public.ts`
 * and Google's preferred `gmp-map` web component. Supply verified coordinates
 * from a loader; never geocode or approximate important locations in the UI.
 */
import { ExternalLinkIcon, MapIcon, MapPinIcon } from "lucide-react";
import {
  useEffect,
  useId,
  useState,
  type DetailedHTMLProps,
  type HTMLAttributes,
} from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GOOGLE_MAPS_BROWSER_API_KEY,
  GOOGLE_MAPS_MAP_ID,
} from "@/lib/google-maps-public";

type GoogleMapElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  center?: string;
  zoom?: string;
  "map-id"?: string;
  "gesture-handling"?: "auto" | "cooperative" | "greedy" | "none";
};

type GoogleMarkerElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  position?: string;
  title?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "gmp-map": GoogleMapElementProps;
      "gmp-advanced-marker": GoogleMarkerElementProps;
    }
  }
}

export type GoogleMapPoint = {
  id: string;
  label: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  category?: string;
};

let googleMapsLoad: Promise<void> | undefined;

function loadGoogleMaps() {
  if (customElements.get("gmp-map")) return Promise.resolve();
  if (googleMapsLoad) return googleMapsLoad;

  googleMapsLoad = new Promise<void>((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      "script[data-convos-google-maps]",
    );
    if (!script) {
      const url = new URL("https://maps.googleapis.com/maps/api/js");
      url.searchParams.set("key", GOOGLE_MAPS_BROWSER_API_KEY);
      url.searchParams.set("loading", "async");
      url.searchParams.set("libraries", "maps,marker");
      url.searchParams.set("v", "weekly");

      script = document.createElement("script");
      script.src = url.toString();
      script.async = true;
      script.dataset.convosGoogleMaps = "true";
      document.head.appendChild(script);
    }

    script.addEventListener(
      "error",
      () => reject(new Error("Google Maps failed to load")),
      { once: true },
    );
    Promise.all([
      customElements.whenDefined("gmp-map"),
      customElements.whenDefined("gmp-advanced-marker"),
    ]).then(() => resolve(), reject);
  });

  return googleMapsLoad;
}

function mapsSearchUrl(point: GoogleMapPoint) {
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", `${point.latitude},${point.longitude}`);
  return url.toString();
}

export function GoogleMapPoints({
  title,
  description,
  center,
  zoom = 13,
  points,
}: {
  title: string;
  description?: string;
  center: { latitude: number; longitude: number };
  zoom?: number;
  points: GoogleMapPoint[];
}) {
  const titleId = useId();
  const [loadState, setLoadState] = useState<
    "loading" | "ready" | "error"
  >("loading");

  useEffect(() => {
    let active = true;
    loadGoogleMaps().then(
      () => {
        if (active) setLoadState("ready");
      },
      () => {
        if (active) setLoadState("error");
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <div>
        <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <MapIcon className="size-4" aria-hidden="true" />
          Points of interest
        </p>
        <h2
          id={titleId}
          className="mt-1 text-3xl font-semibold tracking-tight"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.5fr)]">
        <div className="relative min-h-96 overflow-hidden rounded-xl border bg-muted shadow-sm">
          {loadState === "loading" ? (
            <div
              className="absolute inset-0 animate-pulse bg-muted"
              role="status"
            >
              <span className="sr-only">Loading map</span>
            </div>
          ) : null}

          {loadState === "error" ? (
            <div className="absolute inset-0 grid place-items-center p-6">
              <Alert variant="destructive" className="max-w-md bg-background">
                <MapPinIcon aria-hidden="true" />
                <AlertTitle>Map unavailable</AlertTitle>
                <AlertDescription>
                  Use the point list to open each location in Google Maps.
                </AlertDescription>
              </Alert>
            </div>
          ) : null}

          {loadState === "ready" ? (
            <gmp-map
              center={`${center.latitude},${center.longitude}`}
              zoom={String(zoom)}
              map-id={GOOGLE_MAPS_MAP_ID}
              gesture-handling="cooperative"
              className="absolute inset-0 size-full"
              aria-label={title}
            >
              {points.map((point, index) => (
                <gmp-advanced-marker
                  key={point.id}
                  position={`${point.latitude},${point.longitude}`}
                  title={`${index + 1}. ${point.label}`}
                />
              ))}
            </gmp-map>
          ) : null}
        </div>

        <ol className="space-y-3">
          {points.length === 0 ? (
            <li>
              <Card className="py-4">
                <CardContent className="px-4 text-sm text-muted-foreground">
                  No points of interest are available.
                </CardContent>
              </Card>
            </li>
          ) : null}

          {points.map((point, index) => (
            <li key={point.id}>
              <Card className="gap-4 py-4">
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
                  <a
                    href={mapsSearchUrl(point)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Open in Google Maps
                    <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                  </a>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
