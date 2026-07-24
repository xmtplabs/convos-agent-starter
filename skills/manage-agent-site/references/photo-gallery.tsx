/**
 * Copy this component into `src/components/photo-gallery.tsx`. Import committed
 * images through Vite and pass their resolved URLs. Keep width, height, useful
 * alt text, and credit with the image record.
 */
import { ExpandIcon, ImagesIcon } from "lucide-react";
import { useId, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
  credit?: string;
  width: number;
  height: number;
};

export function PhotoGallery({
  title,
  description,
  photos,
}: {
  title: string;
  description?: string;
  photos: GalleryPhoto[];
}) {
  const titleId = useId();
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  return (
    <section aria-labelledby={titleId} className="space-y-5">
      <div>
        <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <ImagesIcon className="size-4" aria-hidden="true" />
          Photo gallery
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

      {photos.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No photos have been added yet.
        </div>
      ) : (
        <Dialog
          open={selected !== null}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <div className="grid auto-rows-[12rem] gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <DialogTrigger key={photo.id} asChild>
                <button
                  type="button"
                  onClick={() => setSelected(photo)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border bg-muted text-left outline-none focus-visible:ring-4 focus-visible:ring-ring/50",
                    index === 0 &&
                      "sm:col-span-2 sm:row-span-2 sm:min-h-[25rem]",
                  )}
                  aria-label={`Open ${photo.title}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="size-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                  <span
                    className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
                    <span>
                      <span className="block font-medium">{photo.title}</span>
                      {photo.credit ? (
                        <span className="mt-1 block text-xs text-white/75">
                          {photo.credit}
                        </span>
                      ) : null}
                    </span>
                    <ExpandIcon className="size-4 shrink-0" aria-hidden="true" />
                  </span>
                </button>
              </DialogTrigger>
            ))}
          </div>

          {selected ? (
            <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-3 sm:max-w-5xl">
              <img
                src={selected.src}
                alt={selected.alt}
                width={selected.width}
                height={selected.height}
                className="max-h-[70dvh] w-full rounded-md bg-muted object-contain"
              />
              <DialogHeader className="px-3 pb-3">
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>
                  {selected.description ?? selected.alt}
                  {selected.credit ? (
                    <span className="mt-1 block">Photo: {selected.credit}</span>
                  ) : null}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          ) : null}
        </Dialog>
      )}
    </section>
  );
}
