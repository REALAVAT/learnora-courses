"use client";

import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  ClockIcon,
  FlameIcon,
  NotebookPenIcon,
  PlayIcon,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { EmptyState } from "@/components/app/empty-state";
import { CourseCard } from "@/components/course/course-card";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { findLesson, flatLessons, toSummary } from "@/lib/course-utils";
import { courses, getCourse } from "@/lib/data/courses";
import { formatDate, formatTimestamp } from "@/lib/format";
import { useAuth } from "@/lib/store/auth";
import { useLearning } from "@/lib/store/learning";
import { cn } from "@/lib/utils";
import { EnrolledCourseCard } from "./enrolled-course-card";
import { useEnrolledCourses } from "./use-enrolled";

const weekDays = [true, true, false, true, false, false, false];

export function DashboardView() {
  const t = useTranslations("Learn");
  const locale = useLocale() as Locale;
  const user = useAuth((s) => s.user);
  const notes = useLearning((s) => s.notes);
  const certificates = useLearning((s) => s.certificates);
  const completed = useLearning((s) => s.completed);
  const enrolled = useEnrolledCourses();

  const stats = useMemo(() => {
    let lessons = 0;
    let minutes = 0;
    for (const item of enrolled) {
      const done = new Set(completed[item.course.slug] ?? []);
      for (const lesson of flatLessons(item.course)) {
        if (done.has(lesson.id)) {
          lessons += 1;
          minutes += lesson.duration;
        }
      }
    }
    return { lessons, hours: Math.round((minutes / 60) * 10) / 10 };
  }, [enrolled, completed]);

  const current = enrolled.find((e) => e.done < e.total);
  const currentLesson = current ? findLesson(current.course, current.resumeLessonId) : undefined;
  const currentIndex = current
    ? flatLessons(current.course).findIndex((l) => l.id === current.resumeLessonId) + 1
    : 0;

  const recommended = useMemo(() => {
    const enrolledSlugs = new Set(enrolled.map((e) => e.course.slug));
    const categories = new Set(enrolled.map((e) => e.course.category));
    return courses
      .filter((c) => !enrolledSlugs.has(c.slug))
      .sort(
        (a, b) =>
          Number(categories.has(b.category)) - Number(categories.has(a.category)) || b.rating - a.rating,
      )
      .slice(0, 3)
      .map(toSummary);
  }, [enrolled]);

  const firstName = user?.name.split(" ")[0] ?? "";

  const statCards = [
    {
      label: t("stats.enrolled"),
      value: enrolled.length,
      icon: BookOpenIcon,
      tone: "bg-indigo-soft text-primary",
    },
    {
      label: t("stats.completedLessons"),
      value: stats.lessons,
      icon: CheckCircle2Icon,
      tone: "bg-success/15 text-success",
    },
    { label: t("stats.hours"), value: stats.hours, icon: ClockIcon, tone: "bg-coral-soft text-coral-strong" },
    {
      label: t("stats.certificates"),
      value: certificates.length,
      icon: AwardIcon,
      tone: "bg-star/20 text-foreground",
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">{t("greeting", { name: firstName })}</h1>
        <p className="mt-2 text-muted-foreground">{t("greetingSubtitle")}</p>
      </header>

      <dl className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border bg-card p-5">
            <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl", tone)}>
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <div className="flex min-w-0 flex-col-reverse">
              <dt className="truncate text-xs text-muted-foreground sm:text-sm">{label}</dt>
              <dd className="text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      {enrolled.length === 0 ? (
        <EmptyState
          icon={BookOpenIcon}
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={{ label: t("emptyCta"), href: "/courses" }}
        />
      ) : (
        <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
          <div className="flex min-w-0 flex-col gap-10">
            {current && currentLesson ? (
              <section aria-labelledby="continue-title">
                <h2 id="continue-title" className="mb-4 text-xl font-semibold">
                  {t("continueTitle")}
                </h2>
                <div className="grid overflow-hidden rounded-3xl border bg-card sm:grid-cols-[minmax(0,1fr)_1.2fr]">
                  <div className="relative aspect-video sm:aspect-auto sm:min-h-56">
                    <Image
                      src={current.course.image}
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 640px) 400px, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-black/25">
                      <span className="grid size-14 place-items-center rounded-full bg-white/95 text-primary shadow-xl">
                        <PlayIcon aria-hidden="true" className="ml-0.5 size-6 fill-current" />
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 p-6">
                    <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                      {t("lessonOf", { current: currentIndex, total: current.total })}
                    </p>
                    <h3 className="text-xl leading-snug font-semibold">{current.course.title[locale]}</h3>
                    <p className="text-sm text-muted-foreground">{currentLesson.lesson.title[locale]}</p>
                    <div className="mt-auto flex flex-col gap-1.5 pt-2">
                      <span className="text-xs font-medium">
                        {t("progress", { percent: current.progress })}
                      </span>
                      <Progress
                        value={current.progress}
                        aria-label={`${t("progressLabel")}: ${current.course.title[locale]}`}
                      />
                    </div>
                    <Link
                      href={`/learn/courses/${current.course.slug}/${current.resumeLessonId}`}
                      className={cn(buttonVariants({ size: "xl" }), "mt-2 self-start")}
                    >
                      <PlayIcon aria-hidden="true" />
                      {t("continueCta")}
                    </Link>
                  </div>
                </div>
              </section>
            ) : null}

            <section aria-labelledby="my-courses-title">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 id="my-courses-title" className="text-xl font-semibold">
                  {t("nav.courses")}
                </h2>
                <Link
                  href="/learn/courses"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {t("all")}
                  <ArrowRightIcon aria-hidden="true" className="size-4" />
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                {enrolled.slice(0, 3).map((item) => (
                  <EnrolledCourseCard key={item.course.slug} item={item} />
                ))}
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section aria-labelledby="goal-title" className="rounded-2xl border bg-card p-5">
              <h2 id="goal-title" className="flex items-center gap-2 font-semibold">
                <FlameIcon aria-hidden="true" className="size-5 text-coral-strong" />
                {t("streakTitle")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("streakBody", { days: weekDays.filter(Boolean).length })}
              </p>
              <ol className="mt-4 flex justify-between gap-1" aria-hidden="true">
                {weekDays.map((active, i) => (
                  <li
                    key={i}
                    className={cn(
                      "grid size-8 place-items-center rounded-full text-xs font-semibold",
                      active ? "bg-coral text-foreground" : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(new Date(2026, 9, 5 + i))}
                  </li>
                ))}
              </ol>
            </section>

            <section aria-labelledby="notes-title" className="rounded-2xl border bg-card p-5">
              <h2 id="notes-title" className="flex items-center gap-2 font-semibold">
                <NotebookPenIcon aria-hidden="true" className="size-5 text-primary" />
                {t("recentNotes")}
              </h2>
              {notes.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">{t("noNotes")}</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-3">
                  {notes.slice(0, 3).map((note) => {
                    const course = getCourse(note.slug);
                    return (
                      <li key={note.id}>
                        <Link
                          href={`/learn/courses/${note.slug}/${note.lessonId}`}
                          className="block rounded-xl bg-muted/60 p-3 transition-colors hover:bg-secondary"
                        >
                          <p className="line-clamp-2 text-sm">{note.text}</p>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {course?.title[locale]} · {formatTimestamp(note.seconds)} ·{" "}
                            {formatDate(note.createdAt, locale, "short")}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}

      <section aria-labelledby="recommended-title">
        <h2 id="recommended-title" className="mb-4 text-xl font-semibold">
          {t("recommended")}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {recommended.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>
    </div>
  );
}
