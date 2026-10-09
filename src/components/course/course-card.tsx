import { ClockIcon, PlayCircleIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDuration } from "@/lib/format";
import type { CourseSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Price } from "./price";
import { Rating } from "./rating";
import { WishlistButton } from "./wishlist-button";

export function CourseCard({
  course,
  layout = "grid",
  priority,
  headingLevel = "h3",
}: {
  course: CourseSummary;
  layout?: "grid" | "list";
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const t = useTranslations("Common");
  const tc = useTranslations("CourseCard");
  const locale = useLocale() as Locale;
  const title = course.title[locale];
  const Heading = headingLevel;
  const list = layout === "list";

  return (
    <div className="group h-full">
      <article
        className={cn(
          "relative isolate flex h-full overflow-hidden rounded-2xl border bg-card transition-[translate,box-shadow,border-color] duration-300 ease-out will-change-[translate] group-hover:-translate-y-1 group-hover:border-primary/25 group-hover:shadow-[0_18px_40px_-20px_color-mix(in_oklch,var(--primary)_45%,transparent)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0",
          list ? "flex-col sm:flex-row" : "flex-col",
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-muted",
            list ? "aspect-16/10 sm:aspect-auto sm:w-72" : "aspect-16/10",
          )}
        >
          <Image
            src={course.image}
            alt=""
            fill
            priority={priority}
            sizes={
              list
                ? "(min-width: 640px) 288px, 100vw"
                : "(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {course.bestseller ? <Badge className="bg-star text-foreground">{t("bestseller")}</Badge> : null}
            {course.isNew ? <Badge className="bg-coral text-foreground">{t("new")}</Badge> : null}
            {course.language === "es" ? (
              <Badge variant="secondary" className="bg-card/90">
                {tc("spanish")}
              </Badge>
            ) : null}
          </div>
          <WishlistButton slug={course.slug} title={title} className="absolute top-3 right-3 z-10" />
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <p className="text-xs font-medium tracking-wide text-primary uppercase">
            {t(`category.${course.category}`)}
          </p>
          <Heading className="text-base leading-snug font-semibold tracking-tight text-balance">
            <Link
              href={`/courses/${course.slug}`}
              className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/50"
            >
              {title}
            </Link>
          </Heading>
          {list ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">{course.subtitle[locale]}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">{tc("by", { name: course.instructor.name })}</p>
          <Rating rating={course.rating} count={course.ratingCount} />
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ClockIcon aria-hidden="true" className="size-3.5" />
              {formatDuration(course.durationMinutes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <PlayCircleIcon aria-hidden="true" className="size-3.5" />
              {t("lessons", { count: course.lessonCount })}
            </span>
            <span>{t(`level.${course.level}`)}</span>
          </div>
          <div className="mt-auto flex items-center justify-between pt-2">
            <Price price={course.price} originalPrice={course.originalPrice} />
            {course.originalPrice && course.originalPrice > course.price ? (
              <span className="rounded-full bg-coral-soft px-2 py-0.5 text-xs font-medium text-coral-strong">
                {tc("discount", {
                  percent: Math.round((1 - course.price / course.originalPrice) * 100),
                })}
              </span>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
