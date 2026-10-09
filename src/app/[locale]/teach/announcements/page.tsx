import { setRequestLocale } from "next-intl/server";
import { TeachAnnouncementsView } from "@/components/teach/announcements-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/teach/announcements">) {
  return appMetadata(params, "TeachAnnouncements");
}

export default async function TeachAnnouncementsPage({ params }: PageProps<"/[locale]/teach/announcements">) {
  setRequestLocale((await params).locale as Locale);
  return <TeachAnnouncementsView />;
}
