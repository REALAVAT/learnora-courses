import { setRequestLocale } from "next-intl/server";
import { CertificatesView } from "@/components/learn/certificates-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/learn/certificates">) {
  return appMetadata(params, "Certificate");
}

export default async function CertificatesPage({ params }: PageProps<"/[locale]/learn/certificates">) {
  setRequestLocale((await params).locale as Locale);
  return <CertificatesView />;
}
