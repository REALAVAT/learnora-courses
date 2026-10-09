import { setRequestLocale } from "next-intl/server";
import { TeachDashboardView } from "@/components/teach/dashboard-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/teach">) {
  return appMetadata(params, "Teach");
}

export default async function TeachPage({ params }: PageProps<"/[locale]/teach">) {
  setRequestLocale((await params).locale as Locale);
  return <TeachDashboardView />;
}
