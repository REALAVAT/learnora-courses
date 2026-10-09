"use client";

import { motion } from "framer-motion";
import {
  CaptionsIcon,
  CaptionsOffIcon,
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";

export const chapterKeys = ["intro", "concept", "walkthrough", "practice", "recap"] as const;
export type ChapterKey = (typeof chapterKeys)[number];

const chapterStarts = [0, 0.1, 0.32, 0.68, 0.88];

export function buildChapters(durationSec: number) {
  return chapterKeys.map((key, i) => ({ key, start: Math.round(chapterStarts[i] * durationSec) }));
}

export type PlayerApi = {
  seek: (seconds: number) => void;
  play: () => void;
  getTime: () => number;
};

const speeds = [1, 1.25, 1.5, 2];

export function VideoPlayer({
  poster,
  title,
  durationSec,
  label,
  autoPlay = false,
  initialTime = 0,
  onEnded,
  onProgress,
  apiRef,
  className,
}: {
  poster: string;
  title: string;
  durationSec: number;
  label: string;
  autoPlay?: boolean;
  initialTime?: number;
  onEnded?: () => void;
  onProgress?: (seconds: number) => void;
  apiRef?: React.Ref<PlayerApi>;
  className?: string;
}) {
  const t = useTranslations("Player");
  const wrapper = useRef<HTMLDivElement>(null);
  const timeRef = useRef(initialTime);
  const callbacks = useRef({ onEnded, onProgress });
  const [time, setTimeState] = useState(initialTime);
  const [playing, setPlaying] = useState(autoPlay);
  const [started, setStarted] = useState(autoPlay || initialTime > 0);
  const [speed, setSpeed] = useState(1);
  const [captions, setCaptions] = useState(true);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    callbacks.current = { onEnded, onProgress };
  });

  function setTime(value: number) {
    const next = Math.max(0, Math.min(value, durationSec));
    timeRef.current = next;
    setTimeState(next);
    callbacks.current.onProgress?.(next);
  }

  function play() {
    if (timeRef.current >= durationSec) setTime(0);
    setStarted(true);
    setPlaying(true);
  }

  useImperativeHandle(apiRef, () => ({
    seek: (seconds: number) => {
      setTime(seconds);
      setStarted(true);
    },
    play,
    getTime: () => timeRef.current,
  }));

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const next = Math.min(timeRef.current + 0.25 * speed * 6, durationSec);
      setTime(next);
      if (next >= durationSec) {
        setPlaying(false);
        callbacks.current.onEnded?.();
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed, durationSec]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === wrapper.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const chapters = buildChapters(durationSec);
  const current = [...chapters].reverse().find((c) => time >= c.start) ?? chapters[0];
  const ended = time >= durationSec;

  function toggleFullscreen() {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void wrapper.current?.requestFullscreen?.();
  }

  return (
    <div
      ref={wrapper}
      role="region"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === " " || e.key === "k") {
          e.preventDefault();
          if (playing) setPlaying(false);
          else play();
        }
        if (e.key === "ArrowRight") setTime(timeRef.current + 10);
        if (e.key === "ArrowLeft") setTime(timeRef.current - 10);
      }}
      tabIndex={0}
      className={cn(
        "group/player relative aspect-video w-full overflow-hidden bg-black text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: playing ? 1.08 : 1 }}
        transition={{ duration: playing ? 30 : 0.6, ease: "linear" }}
      >
        <Image src={poster} alt="" fill sizes="(min-width: 1280px) 900px, 100vw" className="object-cover" />
      </motion.div>
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-500",
          started ? "bg-black/35" : "bg-gradient-to-t from-black/70 via-black/20 to-black/10",
        )}
      />

      {started ? (
        <span className="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-white/90 uppercase backdrop-blur">
          {t("demo")}
        </span>
      ) : null}

      {!playing ? (
        <button
          type="button"
          onClick={play}
          aria-label={ended ? t("play") : t("playLesson", { title })}
          className="absolute top-1/2 left-1/2 grid size-18 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-primary shadow-2xl transition-transform outline-none hover:scale-105 focus-visible:ring-4 focus-visible:ring-white/60 motion-reduce:hover:scale-100"
        >
          {ended ? (
            <RotateCcwIcon aria-hidden="true" className="size-7" />
          ) : (
            <PlayIcon aria-hidden="true" className="ml-1 size-7 fill-current" />
          )}
        </button>
      ) : (
        <button
          type="button"
          aria-label={t("pause")}
          onClick={() => setPlaying(false)}
          className="absolute inset-0 cursor-default"
        />
      )}

      {!started ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
          <p className="text-lg font-semibold text-balance drop-shadow">{title}</p>
          <p className="mt-1 text-sm text-white/80">{formatTimestamp(durationSec)}</p>
        </div>
      ) : (
        <>
          {captions && playing ? (
            <p
              aria-live="off"
              className="pointer-events-none absolute inset-x-6 bottom-20 mx-auto max-w-xl rounded-md bg-black/70 px-3 py-1.5 text-center text-sm text-white sm:text-base"
            >
              {t(`caption.${current.key}`)}
            </p>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pt-10 pb-2.5 sm:px-4">
            <div className="relative h-4">
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-coral"
                  style={{ width: `${(time / durationSec) * 100}%` }}
                />
              </div>
              {chapters.slice(1).map((c) => (
                <span
                  key={c.key}
                  aria-hidden="true"
                  className="absolute top-1/2 h-2 w-0.5 -translate-y-1/2 bg-black/60"
                  style={{ left: `${(c.start / durationSec) * 100}%` }}
                />
              ))}
              <input
                type="range"
                min={0}
                max={durationSec}
                step={1}
                value={Math.round(time)}
                onChange={(e) => {
                  setStarted(true);
                  setTime(Number(e.target.value));
                }}
                aria-label={t("seek")}
                aria-valuetext={`${formatTimestamp(time)} / ${formatTimestamp(durationSec)}`}
                className="absolute inset-0 h-4 w-full cursor-pointer opacity-0"
              />
            </div>
            <div className="mt-1 flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => (playing ? setPlaying(false) : play())}
                aria-label={playing ? t("pause") : t("play")}
                className="grid size-9 place-items-center rounded-md hover:bg-white/15"
              >
                {playing ? (
                  <PauseIcon aria-hidden="true" className="size-5 fill-current" />
                ) : (
                  <PlayIcon aria-hidden="true" className="size-5 fill-current" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? t("unmute") : t("mute")}
                className="grid size-9 place-items-center rounded-md hover:bg-white/15"
              >
                {muted ? (
                  <VolumeXIcon aria-hidden="true" className="size-5" />
                ) : (
                  <Volume2Icon aria-hidden="true" className="size-5" />
                )}
              </button>
              <span className="font-mono text-xs tabular-nums sm:text-sm">
                {formatTimestamp(time)} / {formatTimestamp(durationSec)}
              </span>
              <span className="ml-2 hidden truncate text-xs text-white/75 sm:inline">
                {t(`chapter.${current.key}`)}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSpeed((s) => speeds[(speeds.indexOf(s) + 1) % speeds.length])}
                  aria-label={`${t("speed")}: ${speed}x`}
                  className="h-9 min-w-11 rounded-md px-2 font-mono text-xs font-semibold hover:bg-white/15"
                >
                  {speed}x
                </button>
                <button
                  type="button"
                  onClick={() => setCaptions((c) => !c)}
                  aria-label={captions ? t("captionsOff") : t("captionsOn")}
                  aria-pressed={captions}
                  className="grid size-9 place-items-center rounded-md hover:bg-white/15"
                >
                  {captions ? (
                    <CaptionsIcon aria-hidden="true" className="size-5" />
                  ) : (
                    <CaptionsOffIcon aria-hidden="true" className="size-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={fullscreen ? t("exitFullscreen") : t("fullscreen")}
                  className="grid size-9 place-items-center rounded-md hover:bg-white/15"
                >
                  {fullscreen ? (
                    <MinimizeIcon aria-hidden="true" className="size-5" />
                  ) : (
                    <MaximizeIcon aria-hidden="true" className="size-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
