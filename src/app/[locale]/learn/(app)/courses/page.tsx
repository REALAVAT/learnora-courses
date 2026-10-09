import { setRequestLocale } from "next-intl/server";
import { MyCoursesView } from "@/components/learn/my-courses-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/learn/courses">) {
  return appMetadata(params, "Learn");
}

export default async function MyCoursesPage({ params }: PageProps<"/[locale]/learn/courses">) {
  setRequestLocale((await params).locale as Locale);
  return <MyCoursesView />;
}
