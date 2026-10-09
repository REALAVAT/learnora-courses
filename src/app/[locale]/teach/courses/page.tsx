import { setRequestLocale } from "next-intl/server";
import { TeachCoursesView } from "@/components/teach/courses-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/teach/courses">) {
  return appMetadata(params, "TeachCourses");
}

export default async function TeachCoursesPage({
  params,
  searchParams,
}: PageProps<"/[locale]/teach/courses">) {
  setRequestLocale((await params).locale as Locale);
  const { new: openNew } = await searchParams;
  return <TeachCoursesView openNew={openNew === "1"} />;
}
