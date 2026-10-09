import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { InstructorCard } from "@/components/marketing/instructor-card";
import { Reveal } from "@/components/motion/reveal";
import { routing } from "@/i18n/routing";
import { instructors } from "@/lib/data/instructors";
import { localizedUrl, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/instructors">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Instructors" });
  return pageMetadata({ locale, path: "/instructors", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function InstructorsPage({ params }: PageProps<"/[locale]/instructors">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Instructors");
  const tcat = await getTranslations("Catalog");

  return (
    <div className="container-page py-10 lg:py-14">
      <BreadcrumbJsonLd
        items={[
          { name: tcat("breadcrumbHome"), url: localizedUrl(locale) },
          { name: t("metaTitle"), url: localizedUrl(locale, "/instructors") },
        ]}
      />
      <Breadcrumbs items={[{ label: tcat("breadcrumbHome"), href: "/" }, { label: t("metaTitle") }]} />
      <header className="mt-5 mb-10 max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{t("title")}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {instructors.map((instructor, i) => (
          <Reveal key={instructor.slug} delay={(i % 4) * 0.05}>
            <InstructorCard instructor={instructor} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
