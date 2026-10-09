import { ArrowLeftIcon, ClockIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/blog/post-card";
import { Price } from "@/components/course/price";
import { BreadcrumbJsonLd, JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { loadPostContent } from "@/lib/blog";
import { getCourse } from "@/lib/data/courses";
import { getInstructor } from "@/lib/data/instructors";
import { getPost, posts } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";
import { localizedUrl, pageMetadata } from "@/lib/seo";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!hasLocale(routing.locales, locale) || !post) return {};
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.title[locale],
    description: post.excerpt[locale],
    type: "article",
  });
}

export default async function BlogPostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const post = getPost(slug);
  if (!post) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Blog");
  const tcat = await getTranslations("Catalog");
  const Content = await loadPostContent(locale, slug);
  const author = getInstructor(post.authorId);
  const course = post.relatedCourse ? getCourse(post.relatedCourse) : undefined;
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3);
  const url = localizedUrl(locale, `/blog/${slug}`);

  return (
    <div className="pb-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title[locale],
          description: post.excerpt[locale],
          image: post.image,
          datePublished: post.date,
          dateModified: post.date,
          inLanguage: locale,
          mainEntityOfPage: url,
          author: author
            ? {
                "@type": "Person",
                name: author.name,
                url: localizedUrl(locale, `/instructors/${author.slug}`),
              }
            : undefined,
          publisher: { "@type": "Organization", name: siteConfig.name, logo: `${getSiteUrl()}/icon.svg` },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: tcat("breadcrumbHome"), url: localizedUrl(locale) },
          { name: t("metaTitle"), url: localizedUrl(locale, "/blog") },
          { name: post.title[locale], url },
        ]}
      />

      <article>
        <header className="container-page max-w-4xl pt-10 lg:pt-14">
          <Breadcrumbs
            items={[
              { label: tcat("breadcrumbHome"), href: "/" },
              { label: t("metaTitle"), href: "/blog" },
              { label: post.title[locale] },
            ]}
            className="hidden sm:block"
          />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:hidden"
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            {t("backToBlog")}
          </Link>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {post.tags.map((tag) => (
              <span key={tag.en} className="rounded-full bg-secondary px-2.5 py-0.5 font-medium text-primary">
                {tag[locale]}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
            {post.title[locale]}
          </h1>
          <p className="mt-4 text-lg text-pretty text-muted-foreground sm:text-xl">{post.excerpt[locale]}</p>
          <div className="mt-6 flex items-center gap-3 text-sm">
            {author ? (
              <Image
                src={author.avatar}
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-full object-cover"
              />
            ) : null}
            <div className="flex flex-col">
              {author ? (
                <Link href={`/instructors/${author.slug}`} className="font-medium hover:text-primary">
                  {t("byline", { author: author.name })}
                </Link>
              ) : null}
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <time dateTime={post.date}>{formatDate(post.date, locale)}</time> ·
                <ClockIcon aria-hidden="true" className="size-3.5" />
                {t("readTime", { minutes: post.readMinutes })}
              </span>
            </div>
          </div>
        </header>

        <div className="container-page mt-10 max-w-5xl">
          <div className="relative aspect-[16/8] overflow-hidden rounded-3xl bg-muted">
            <Image
              src={post.image}
              alt={post.imageAlt[locale]}
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="container-page mt-10 max-w-[44rem]">
          <Content />
        </div>
      </article>

      {course ? (
        <aside className="container-page mt-12 max-w-[44rem]">
          <div className="flex flex-col gap-5 rounded-3xl border bg-card p-5 sm:flex-row sm:items-center">
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl sm:w-44">
              <Image src={course.image} alt="" fill sizes="176px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                {t("relatedCourse")}
              </p>
              <p className="text-lg font-semibold">{course.title[locale]}</p>
              <Price price={course.price} originalPrice={course.originalPrice} />
            </div>
            <Link href={`/courses/${course.slug}`} className={buttonVariants({ size: "xl" })}>
              {t("relatedCourseCta")}
            </Link>
          </div>
        </aside>
      ) : null}

      <section aria-labelledby="more-title" className="container-page mt-20">
        <h2 id="more-title" className="text-2xl font-semibold tracking-tight">
          {t("keepReading")}
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((p) => (
            <PostCard key={p.slug} post={p} headingLevel={3} />
          ))}
        </div>
      </section>
    </div>
  );
}
