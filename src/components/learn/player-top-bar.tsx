"use client";

import { ChevronLeftIcon, ListIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Course } from "@/lib/types";
import { PlayerCurriculum } from "./player-curriculum";

export function PlayerTopBar({
  course,
  done,
  currentLessonId,
  quizState,
  quizScore,
}: {
  course: Course;
  done: Set<string>;
  currentLessonId?: string;
  quizState: "locked" | "ready" | "passed";
  quizScore?: number;
}) {
  const t = useTranslations("Lesson");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);
  const total = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const percent = Math.round((done.size / total) * 100);

  return (
    <header className="no-print sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-[oklch(0.2_0.06_282)] px-3 text-white sm:px-5">
      <Link
        href="/learn/courses"
        className="flex shrink-0 items-center gap-2 rounded-lg py-1 pr-2 text-sm font-medium text-white/85 outline-none hover:text-white focus-visible:ring-3 focus-visible:ring-white/40"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-4" />
        <LogoMark className="size-7" />
        <span className="hidden md:inline">{t("backToCourses")}</span>
      </Link>
      <span aria-hidden="true" className="hidden h-6 w-px bg-white/15 sm:block" />
      <p className="min-w-0 flex-1 truncate text-sm font-semibold sm:text-base">{course.title[locale]}</p>
      <div className="hidden w-48 flex-col gap-1 md:flex">
        <span className="text-xs text-white/75">{t("courseProgress", { done: done.size, total })}</span>
        <Progress
          value={percent}
          aria-label={t("courseProgress", { done: done.size, total })}
          className="[&_[data-slot=progress-indicator]]:bg-coral [&_[data-slot=progress-track]]:bg-white/15"
        />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-white lg:hidden"
            />
          }
        >
          <ListIcon aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">{t("curriculum")}</span>
        </SheetTrigger>
        <SheetContent side="right" className="w-[90vw] max-w-sm gap-0 overflow-y-auto p-0">
          <SheetHeader className="border-b px-4 py-4">
            <SheetTitle>{t("curriculum")}</SheetTitle>
            <p className="text-xs text-muted-foreground">{t("courseProgress", { done: done.size, total })}</p>
          </SheetHeader>
          <PlayerCurriculum
            course={course}
            currentLessonId={currentLessonId}
            done={done}
            quizState={quizState}
            quizScore={quizScore}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </header>
  );
}
