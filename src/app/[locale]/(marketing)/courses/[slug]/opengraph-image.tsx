import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { lessonCount } from "@/lib/course-utils";
import { courses, getCourse } from "@/lib/data/courses";
import { getInstructor } from "@/lib/data/instructors";
import { formatPrice } from "@/lib/format";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Learnora course";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => courses.map((c) => ({ locale, slug: c.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const course = getCourse(slug) ?? courses[0];
  const instructor = getInstructor(course.instructorId);
  const t = await getTranslations({ locale, namespace: "Common" });

  return renderOgImage({
    eyebrow: t(`category.${course.category}`),
    title: course.title[locale],
    subtitle: course.subtitle[locale],
    meta: [
      instructor?.name ?? "",
      t(`level.${course.level}`),
      t("lessons", { count: lessonCount(course) }),
      course.price === 0 ? t("free") : formatPrice(course.price, locale),
    ].filter(Boolean),
  });
}
