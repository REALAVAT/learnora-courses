import { setRequestLocale } from "next-intl/server";
import { TeachAnalyticsView } from "@/components/teach/analytics-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/teach/analytics">) {
  return appMetadata(params, "TeachAnalytics");
}

export default async function TeachAnalyticsPage({ params }: PageProps<"/[locale]/teach/analytics">) {
  setRequestLocale((await params).locale as Locale);
  return <TeachAnalyticsView />;
}
