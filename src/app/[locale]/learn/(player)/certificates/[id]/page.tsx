import { setRequestLocale } from "next-intl/server";
import { CertificateView } from "@/components/learn/certificate-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/learn/certificates/[id]">) {
  return appMetadata(params, "Certificate");
}

export default async function CertificatePage({ params }: PageProps<"/[locale]/learn/certificates/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);
  return <CertificateView id={id} />;
}
