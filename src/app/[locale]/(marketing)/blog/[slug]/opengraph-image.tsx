import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getInstructor } from "@/lib/data/instructors";
import { getPost, posts } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Learnora blog post";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const post = getPost(slug) ?? posts[0];
  const author = getInstructor(post.authorId);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return renderOgImage({
    eyebrow: t("ogBlogEyebrow", { minutes: post.readMinutes }),
    title: post.title[locale],
    meta: [author?.name ?? "", formatDate(post.date, locale)].filter(Boolean),
  });
}
