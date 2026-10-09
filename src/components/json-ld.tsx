import type { Locale } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";
import { getSiteUrl, siteConfig } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  const url = getSiteUrl();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": `${url}/#organization`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: localizedUrl(locale),
        logo: `${url}/apple-icon`,
        email: siteConfig.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.street,
          addressLocality: siteConfig.city,
          addressRegion: siteConfig.region,
          postalCode: siteConfig.postalCode,
          addressCountry: siteConfig.country,
        },
        sameAs: Object.values(siteConfig.social),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
