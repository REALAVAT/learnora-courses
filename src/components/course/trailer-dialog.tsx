"use client";

import { PlayIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VideoPlayer } from "@/components/player/video-player";
import { cn } from "@/lib/utils";

export function TrailerDialog({
  poster,
  title,
  durationSec = 150,
  variant = "thumbnail",
  label,
  className,
}: {
  poster: string;
  title: string;
  durationSec?: number;
  variant?: "thumbnail" | "link";
  label?: string;
  className?: string;
}) {
  const t = useTranslations("Course");
  const tp = useTranslations("Player");

  return (
    <Dialog>
      {variant === "thumbnail" ? (
        <DialogTrigger
          aria-label={tp("playTrailer", { title })}
          className={cn(
            "group relative block aspect-video w-full overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
            className,
          )}
        >
          <Image src={poster} alt="" fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" priority />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-primary shadow-xl transition-transform group-hover:scale-110 motion-reduce:group-hover:scale-100">
            <PlayIcon aria-hidden="true" className="ml-1 size-6 fill-current" />
          </span>
          <span className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-white">
            {t("previewCourse")}
          </span>
        </DialogTrigger>
      ) : (
        <DialogTrigger
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline",
            className,
          )}
        >
          <PlayIcon aria-hidden="true" className="size-4" />
          {label ?? t("watchTrailer")}
        </DialogTrigger>
      )}
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogTitle className="px-5 pt-4 pb-3 pr-12 text-base">{t("trailerTitle", { title })}</DialogTitle>
        <VideoPlayer poster={poster} title={title} durationSec={durationSec} label={title} autoPlay />
      </DialogContent>
    </Dialog>
  );
}
