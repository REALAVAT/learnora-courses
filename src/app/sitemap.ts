import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { courses } from "@/lib/data/courses";
import { instructors } from "@/lib/data/instructors";
import { posts } from "@/lib/data/posts";
import { languageAlternates, localizedUrl } from "@/lib/seo";

type Entry = {
  path: string;
  lastModified?: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

const siteUpdated = "2026-10-01";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: Entry[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/courses", changeFrequency: "daily", priority: 0.9 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.7 },
    { path: "/instructors", changeFrequency: "monthly", priority: 0.6 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
    ...courses.map((c) => ({
      path: `/courses/${c.slug}`,
      lastModified: c.updated,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...instructors.map((i) => ({
      path: `/instructors/${i.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  return entries.flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: localizedUrl(locale, entry.path),
      lastModified: entry.lastModified ?? siteUpdated,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages: languageAlternates(entry.path) },
    })),
  );
}
