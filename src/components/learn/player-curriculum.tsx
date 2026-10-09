"use client";

import {
  CheckCircle2Icon,
  CircleIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  LockIcon,
  PlayCircleIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PlayerCurriculum({
  course,
  currentLessonId,
  done,
  quizState,
  quizScore,
  onNavigate,
}: {
  course: Course;
  currentLessonId?: string;
  done: Set<string>;
  quizState: "locked" | "ready" | "passed";
  quizScore?: number;
  onNavigate?: () => void;
}) {
  const t = useTranslations("Lesson");
  const locale = useLocale() as Locale;

  return (
    <nav aria-label={t("curriculum")} className="flex flex-col">
      {course.modules.map((module, mi) => {
        const moduleDone = module.lessons.filter((l) => done.has(l.id)).length;
        return (
          <div key={module.id} className="border-b last:border-b-0">
            <div className="flex items-baseline justify-between gap-3 bg-muted/50 px-4 py-3">
              <h3 className="text-sm font-semibold">
                {mi + 1}. {module.title[locale]}
              </h3>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {moduleDone}/{module.lessons.length}
              </span>
            </div>
            <ol>
              {module.lessons.map((lesson) => {
                const isCurrent = lesson.id === currentLessonId;
                const isDone = done.has(lesson.id);
                const TypeIcon = lesson.type === "article" ? FileTextIcon : PlayCircleIcon;
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/learn/courses/${course.slug}/${lesson.id}`}
                      onClick={onNavigate}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "flex items-start gap-3 border-l-[3px] px-4 py-3 text-sm transition-colors outline-none focus-visible:bg-secondary",
                        isCurrent
                          ? "border-l-primary bg-indigo-soft font-medium"
                          : "border-l-transparent hover:bg-muted/70",
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2Icon
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-success"
                        />
                      ) : (
                        <CircleIcon
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 text-muted-foreground/60"
                        />
                      )}
                      <span className="flex-1">
                        {lesson.title[locale]}
                        {isDone ? <span className="sr-only"> ({t("completed")})</span> : null}
                        <span className="mt-1 flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                          <TypeIcon aria-hidden="true" className="size-3.5" />
                          {lesson.duration} min
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      })}
      <Link
        href={`/learn/courses/${course.slug}/quiz`}
        onClick={onNavigate}
        aria-disabled={quizState === "locked" ? true : undefined}
        className={cn(
          "flex items-center gap-3 border-t px-4 py-4 text-sm transition-colors outline-none hover:bg-muted/70 focus-visible:bg-secondary",
          quizState === "locked" && "text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg",
            quizState === "passed" ? "bg-success/15 text-success" : "bg-indigo-soft text-primary",
          )}
        >
          {quizState === "locked" ? (
            <LockIcon aria-hidden="true" className="size-4" />
          ) : (
            <ClipboardCheckIcon aria-hidden="true" className="size-4" />
          )}
        </span>
        <span className="flex flex-col">
          <span className="font-semibold text-foreground">{t("finalQuiz")}</span>
          <span className="text-xs">
            {quizState === "passed"
              ? t("quizPassed", { score: quizScore ?? 0 })
              : quizState === "ready"
                ? t("quizReady")
                : t("quizLocked")}
          </span>
        </span>
      </Link>
    </nav>
  );
}
