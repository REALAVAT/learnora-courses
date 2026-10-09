import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogView } from "@/components/course/catalog-view";
import { CatalogSkeleton } from "@/components/course/course-card-skeleton";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { routing } from "@/i18n/routing";
import { toSummary } from "@/lib/course-utils";
import { courses } from "@/lib/data/courses";
import { localizedUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/courses">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Catalog" });
  return pageMetadata({ locale, path: "/courses", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function CoursesPage({ params }: PageProps<"/[locale]/courses">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Catalog");
  const summaries = courses.map(toSummary);

  return (
    <div className="container-page py-10 lg:py-14">
      <BreadcrumbJsonLd
        items={[
          { name: t("breadcrumbHome"), url: localizedUrl(locale) },
          { name: t("title"), url: localizedUrl(locale, "/courses") },
        ]}
      />
      <Breadcrumbs items={[{ label: t("breadcrumbHome"), href: "/" }, { label: t("title") }]} />
      <header className="mt-5 mb-10 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>
      <Suspense fallback={<CatalogSkeleton />}>
        <CatalogView courses={summaries} />
      </Suspense>
    </div>
  );
}
