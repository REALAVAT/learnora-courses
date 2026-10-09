import { MapPinIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCoursesByInstructor } from "@/lib/data/courses";
import { formatNumber } from "@/lib/format";
import type { Instructor } from "@/lib/types";

export function InstructorCard({ instructor }: { instructor: Instructor }) {
  const t = useTranslations("Common");
  const locale = useLocale() as Locale;
  const courses = getCoursesByInstructor(instructor.slug);
  const students = courses.reduce((sum, c) => sum + c.students, 0);

  return (
    <article className="group relative flex flex-col items-center rounded-2xl border bg-card p-6 text-center transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:hover:translate-y-0">
      <div className="relative size-24 overflow-hidden rounded-full ring-4 ring-secondary">
        <Image src={instructor.avatar} alt="" fill sizes="96px" className="object-cover" />
      </div>
      <h3 className="mt-4 text-base font-semibold">
        <Link
          href={`/instructors/${instructor.slug}`}
          className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
        >
          {instructor.name}
        </Link>
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">{instructor.role[locale]}</p>
      <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
        <MapPinIcon aria-hidden="true" className="size-3.5" />
        {instructor.location}
      </p>
      <dl className="mt-4 grid w-full grid-cols-3 gap-2 border-t pt-4 text-xs">
        <div className="flex flex-col-reverse gap-0.5">
          <dt className="text-muted-foreground">{t("statRating")}</dt>
          <dd className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-foreground">
            <StarIcon aria-hidden="true" className="size-3.5 fill-star text-star" />
            {instructor.rating.toFixed(1)}
          </dd>
        </div>
        <div className="flex flex-col-reverse gap-0.5">
          <dt className="text-muted-foreground">{t("statStudents")}</dt>
          <dd className="text-sm font-semibold text-foreground">{formatNumber(students, locale, true)}</dd>
        </div>
        <div className="flex flex-col-reverse gap-0.5">
          <dt className="text-muted-foreground">{t("statCourses")}</dt>
          <dd className="text-sm font-semibold text-foreground">{courses.length}</dd>
        </div>
      </dl>
    </article>
  );
}
