import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Providers } from "@/components/providers";
import { OrganizationJsonLd } from "@/components/json-ld";
import { routing } from "@/i18n/routing";
import { geistMono, geistSans } from "@/lib/fonts";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { languageAlternates, localizedUrl } from "@/lib/seo";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#f9f8f5",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: t("title"), template: t("titleTemplate") },
    description: t("description"),
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.authorName, url: siteConfig.authorUrl }],
    creator: siteConfig.authorName,
    alternates: { canonical: localizedUrl(locale), languages: languageAlternates() },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: t("title"),
      description: t("description"),
      url: localizedUrl(locale),
      locale: locale === "es" ? "es_US" : "en_US",
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <OrganizationJsonLd locale={locale} />
      </body>
    </html>
  );
}
