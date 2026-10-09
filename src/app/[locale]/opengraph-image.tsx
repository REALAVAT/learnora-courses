import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { courses } from "@/lib/data/courses";
import { instructors } from "@/lib/data/instructors";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Learnora — online courses for modern professionals";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return renderOgImage({
    eyebrow: t("ogEyebrow"),
    title: t("ogTitle"),
    subtitle: t("ogSubtitle"),
    meta: [
      t("ogCourses", { count: courses.length }),
      t("ogInstructors", { count: instructors.length }),
      "EN · ES",
    ],
  });
}
