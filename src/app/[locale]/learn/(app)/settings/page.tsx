import { setRequestLocale } from "next-intl/server";
import { SettingsView } from "@/components/learn/settings-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/learn/settings">) {
  return appMetadata(params, "Settings");
}

export default async function SettingsPage({ params }: PageProps<"/[locale]/learn/settings">) {
  setRequestLocale((await params).locale as Locale);
  return <SettingsView />;
}
