"use client";

import { AwardIcon, ClipboardCheckIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getInstructor } from "@/lib/data/instructors";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EnrolledCourse } from "./use-enrolled";

export function EnrolledCourseCard({ item }: { item: EnrolledCourse }) {
  const t = useTranslations("Learn");
  const locale = useLocale() as Locale;
  const { course, progress } = item;
  const instructor = getInstructor(course.instructorId);
  const allDone = item.done >= item.total;

  let action: { href: string; label: string; icon: typeof PlayIcon; variant: "default" | "outline" };
  if (item.certificateId) {
    action = {
      href: `/learn/certificates/${item.certificateId}`,
      label: t("viewCertificate"),
      icon: AwardIcon,
      variant: "outline",
    };
  } else if (allDone) {
    action = {
      href: `/learn/courses/${course.slug}/quiz`,
      label: t("takeQuiz"),
      icon: ClipboardCheckIcon,
      variant: "default",
    };
  } else {
    action = {
      href: `/learn/courses/${course.slug}/${item.resumeLessonId}`,
      label: item.done ? t("resume") : t("start"),
      icon: PlayIcon,
      variant: "default",
    };
  }
  const Icon = action.icon;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <Image
          src={course.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
        />
        {item.certificateId ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-semibold text-white">
            <AwardIcon aria-hidden="true" className="size-3.5" />
            {t("completed")}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="leading-snug font-semibold">
            <Link href={`/courses/${course.slug}`} className="hover:text-primary">
              {course.title[locale]}
            </Link>
          </h3>
          {instructor ? <p className="mt-1 text-sm text-muted-foreground">{instructor.name}</p> : null}
        </div>
        <div className="mt-auto flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">{t("progress", { percent: progress })}</span>
            <span className="text-muted-foreground">
              {item.done}/{item.total}
            </span>
          </div>
          <Progress value={progress} aria-label={`${t("progressLabel")}: ${course.title[locale]}`} />
          {item.lastVisitedAt ? (
            <p className="text-xs text-muted-foreground">
              {t("lastVisited", { date: formatDate(item.lastVisitedAt, locale, "short") })}
            </p>
          ) : null}
        </div>
        <Link
          href={action.href}
          className={cn(buttonVariants({ variant: action.variant, size: "lg" }), "mt-1 w-full")}
        >
          <Icon aria-hidden="true" />
          {action.label}
        </Link>
      </div>
    </article>
  );
}
