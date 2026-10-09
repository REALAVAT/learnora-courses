import { setRequestLocale } from "next-intl/server";
import { CourseBuilder } from "@/components/teach/course-builder";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/teach/courses/[id]">) {
  return appMetadata(params, "Builder");
}

export default async function CourseBuilderPage({ params }: PageProps<"/[locale]/teach/courses/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);
  return <CourseBuilder id={id} />;
}
