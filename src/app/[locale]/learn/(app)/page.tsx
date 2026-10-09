import { setRequestLocale } from "next-intl/server";
import { DashboardView } from "@/components/learn/dashboard-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/learn">) {
  return appMetadata(params, "Learn");
}

export default async function LearnDashboardPage({ params }: PageProps<"/[locale]/learn">) {
  setRequestLocale((await params).locale as Locale);
  return <DashboardView />;
}
