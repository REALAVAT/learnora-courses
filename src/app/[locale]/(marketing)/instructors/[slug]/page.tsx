import { BriefcaseIcon, ExternalLinkIcon, MapPinIcon, StarIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/course/course-card";
import { BreadcrumbJsonLd, JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { toSummary } from "@/lib/course-utils";
import { getCoursesByInstructor } from "@/lib/data/courses";
import { getInstructor, instructors } from "@/lib/data/instructors";
import { formatNumber } from "@/lib/format";
import { localizedUrl, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => instructors.map((i) => ({ locale, slug: i.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/instructors/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const instructor = getInstructor(slug);
  if (!hasLocale(routing.locales, locale) || !instructor) return {};
  return pageMetadata({
    locale,
    path: `/instructors/${slug}`,
    title: `${instructor.name} · ${instructor.role[locale]}`,
    description: instructor.bio[locale],
    type: "profile",
  });
}

export default async function InstructorPage({ params }: PageProps<"/[locale]/instructors/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const instructor = getInstructor(slug);
  if (!instructor) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Instructors");
  const tc = await getTranslations("Common");
  const tcat = await getTranslations("Catalog");
  const courses = getCoursesByInstructor(slug);
  const students = courses.reduce((s, c) => s + c.students, 0);
  const reviews = courses.reduce((s, c) => s + c.ratingCount, 0);
  const url = localizedUrl(locale, `/instructors/${slug}`);

  const stats = [
    { label: t("totalStudents"), value: formatNumber(students, locale) },
    { label: t("reviews"), value: formatNumber(reviews, locale) },
    { label: t("courses"), value: String(courses.length) },
    { label: t("rating"), value: instructor.rating.toFixed(1) },
  ];

  return (
    <div className="container-page py-10 lg:py-14">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: instructor.name,
          jobTitle: instructor.role[locale],
          description: instructor.bio[locale],
          image: instructor.avatar,
          url,
          address: { "@type": "PostalAddress", addressLocality: instructor.location },
          sameAs: instructor.links.map((l) => l.href),
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: tcat("breadcrumbHome"), url: localizedUrl(locale) },
          { name: t("metaTitle"), url: localizedUrl(locale, "/instructors") },
          { name: instructor.name, url },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: tcat("breadcrumbHome"), href: "/" },
          { label: t("metaTitle"), href: "/instructors" },
          { label: instructor.name },
        ]}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
        <aside className="flex flex-col gap-6">
          <div className="relative aspect-square w-full max-w-80 overflow-hidden rounded-3xl bg-secondary">
            <Image
              src={instructor.avatar}
              alt={instructor.name}
              fill
              priority
              sizes="(min-width: 1024px) 320px, 80vw"
              className="object-cover"
            />
          </div>
          <dl className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-2xl border bg-card p-4">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="inline-flex items-center gap-1 text-xl font-semibold tracking-tight">
                  {s.label === t("rating") ? (
                    <StarIcon aria-hidden="true" className="size-4 fill-star text-star" />
                  ) : null}
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
          {instructor.links.length ? (
            <div>
              <p className="text-sm font-semibold">{t("links")}</p>
              <ul className="mt-3 flex flex-col gap-2">
                {instructor.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      {link.label}
                      <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>

        <div className="flex min-w-0 flex-col gap-10">
          <header className="flex flex-col gap-3">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">{instructor.role[locale]}</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{instructor.name}</h1>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPinIcon aria-hidden="true" className="size-4" />
                {instructor.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseIcon aria-hidden="true" className="size-4" />
                {t("experience", { years: instructor.yearsExperience })}
              </span>
            </div>
          </header>

          <section aria-labelledby="about-title">
            <h2 id="about-title" className="text-xl font-semibold">
              {t("about", { name: instructor.name.split(" ")[0] })}
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-pretty text-muted-foreground">
              {instructor.bio[locale]}
            </p>
            <div className="mt-5">
              <h3 className="text-sm font-semibold">{t("expertise")}</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {instructor.expertise.map((cat) => (
                  <li key={cat}>
                    <Link href={`/courses?category=${cat}`}>
                      <Badge variant="secondary" className="h-7 px-3 text-sm hover:bg-indigo-soft">
                        {tc(`category.${cat}`)}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="courses-title">
            <h2 id="courses-title" className="text-xl font-semibold">
              {t("coursesBy", { name: instructor.name })}
            </h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c.slug} course={toSummary(c)} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
