import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

const privatePaths = ["/learn", "/teach", "/login", "/signup"];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: routing.locales.flatMap((locale) => privatePaths.map((path) => `/${locale}${path}`)),
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
