import { setRequestLocale } from "next-intl/server";
import { TeachStudentsView } from "@/components/teach/students-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/teach/students">) {
  return appMetadata(params, "TeachStudents");
}

export default async function TeachStudentsPage({ params }: PageProps<"/[locale]/teach/students">) {
  setRequestLocale((await params).locale as Locale);
  return <TeachStudentsView />;
}
