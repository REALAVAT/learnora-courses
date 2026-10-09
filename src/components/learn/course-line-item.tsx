import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Price } from "@/components/course/price";
import { Rating } from "@/components/course/rating";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { courseDuration, lessonCount } from "@/lib/course-utils";
import { getInstructor } from "@/lib/data/instructors";
import { formatDuration } from "@/lib/format";
import type { Course } from "@/lib/types";

export function CourseLineItem({ course, children }: { course: Course; children?: React.ReactNode }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");
  const instructor = getInstructor(course.instructorId);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
      <Link
        href={`/courses/${course.slug}`}
        className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-44"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={course.image}
          alt=""
          fill
          sizes="(min-width: 640px) 176px, 100vw"
          className="object-cover"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold text-balance">
          <Link href={`/courses/${course.slug}`} className="hover:text-primary hover:underline">
            {course.title[locale]}
          </Link>
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{instructor?.name}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <Rating rating={course.rating} count={course.ratingCount} className="text-xs" />
          <span>{formatDuration(courseDuration(course))}</span>
          <span>{t("lessons", { count: lessonCount(course) })}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
        <Price price={course.price} originalPrice={course.originalPrice} />
        <div className="flex flex-wrap justify-end gap-2">{children}</div>
      </div>
    </div>
  );
}
