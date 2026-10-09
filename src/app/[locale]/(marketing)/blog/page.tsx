import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/post-card";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { routing } from "@/i18n/routing";
import { posts } from "@/lib/data/posts";
import { localizedUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Blog" });
  return pageMetadata({ locale, path: "/blog", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Blog");
  const tcat = await getTranslations("Catalog");
  const [featured, ...rest] = posts;

  return (
    <div className="container-page py-10 lg:py-14">
      <BreadcrumbJsonLd
        items={[
          { name: tcat("breadcrumbHome"), url: localizedUrl(locale) },
          { name: t("metaTitle"), url: localizedUrl(locale, "/blog") },
        ]}
      />
      <Breadcrumbs items={[{ label: tcat("breadcrumbHome"), href: "/" }, { label: t("metaTitle") }]} />
      <header className="mt-5 mb-10 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>
      <PostCard post={featured} featured priority />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
