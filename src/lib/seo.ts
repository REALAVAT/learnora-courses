import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl, siteConfig } from "./site";

export function localizedUrl(locale: Locale, path = "") {
  const clean = path === "/" ? "" : path;
  return `${getSiteUrl()}/${locale}${clean}`;
}

export function languageAlternates(path = "") {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = localizedUrl(locale, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return languages;
}

type PageMetadataInput = {
  locale: Locale;
  path: string;
  title?: string;
  description: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article" | "profile";
};

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  noindex,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = localizedUrl(locale, path);
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      locale: locale === "es" ? "es_US" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_US"],
      ...(title ? { title } : {}),
      description,
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
