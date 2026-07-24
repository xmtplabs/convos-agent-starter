/**
 * Copy this component into `src/components/movie-showtimes.tsx` and pass it
 * trusted showtime data from a route loader. Keep poster alt text and exact
 * ISO timestamps; never infer a theater schedule from stale UI state.
 */
import { ClockIcon, MapPinIcon, TicketIcon } from "lucide-react";
import { useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type MovieShowtime = {
  id: string;
  label: string;
  startsAt: string;
  bookingUrl?: string;
  soldOut?: boolean;
};

export type MovieTheater = {
  id: string;
  name: string;
  address: string;
  formats?: string[];
  showtimes: MovieShowtime[];
};

export type MovieListing = {
  id: string;
  title: string;
  posterUrl: string;
  posterAlt: string;
  certificate?: string;
  duration: string;
  genres: string[];
  theaters: MovieTheater[];
};

export function MovieShowtimes({
  dateLabel,
  movies,
}: {
  dateLabel: string;
  movies: MovieListing[];
}) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{dateLabel}</p>
        <h2
          id={titleId}
          className="mt-1 text-2xl font-semibold tracking-tight"
        >
          Movie showtimes
        </h2>
      </div>

      <div className="grid gap-6">
        {movies.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No movie showtimes are available for this date.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {movies.map((movie) => (
          <Card key={movie.id} className="overflow-hidden py-0">
            <div className="grid md:grid-cols-[11rem_1fr]">
              <div className="bg-muted">
                <img
                  src={movie.posterUrl}
                  alt={movie.posterAlt}
                  className="aspect-[2/3] size-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 py-6">
                <CardHeader>
                  <CardTitle className="text-2xl">{movie.title}</CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2">
                    {movie.certificate ? (
                      <Badge variant="outline">{movie.certificate}</Badge>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5">
                      <ClockIcon className="size-4" aria-hidden="true" />
                      {movie.duration}
                    </span>
                    <span>{movie.genres.join(" · ")}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-6 space-y-5">
                  {movie.theaters.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No theaters have published showtimes for this movie.
                    </p>
                  ) : null}

                  {movie.theaters.map((theater, index) => (
                    <div key={theater.id}>
                      {index > 0 ? <Separator className="mb-5" /> : null}
                      <div className="flex flex-col justify-between gap-3 sm:flex-row">
                        <div className="min-w-0">
                          <h3 className="font-semibold">{theater.name}</h3>
                          <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                            <MapPinIcon
                              className="mt-0.5 size-4 shrink-0"
                              aria-hidden="true"
                            />
                            {theater.address}
                          </p>
                        </div>
                        {theater.formats?.length ? (
                          <div className="flex flex-wrap gap-1.5">
                            {theater.formats.map((format) => (
                              <Badge key={format} variant="secondary">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div
                        className="mt-4 flex flex-wrap gap-2"
                        aria-label={`Showtimes at ${theater.name}`}
                      >
                        {theater.showtimes.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No times are currently available.
                          </p>
                        ) : null}

                        {theater.showtimes.map((showtime) =>
                          showtime.bookingUrl && !showtime.soldOut ? (
                            <Button
                              key={showtime.id}
                              asChild
                              variant="outline"
                              size="sm"
                            >
                              <a
                                href={showtime.bookingUrl}
                                aria-label={`${movie.title} at ${showtime.label}, ${theater.name}`}
                              >
                                <TicketIcon aria-hidden="true" />
                                <time dateTime={showtime.startsAt}>
                                  {showtime.label}
                                </time>
                              </a>
                            </Button>
                          ) : (
                            <Button
                              key={showtime.id}
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled
                            >
                              <time dateTime={showtime.startsAt}>
                                {showtime.label}
                              </time>
                              {showtime.soldOut ? "Sold out" : "Unavailable"}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
