import {
  AwardIcon,
  CalendarIcon,
  CheckIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  GlobeIcon,
  InfinityIcon,
  MonitorSmartphoneIcon,
  PlayCircleIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/course/course-card";
import { Curriculum } from "@/components/course/curriculum";
import { EnrollActions, GuaranteeAndShare } from "@/components/course/enroll-actions";
import { MobileEnrollBar } from "@/components/course/mobile-enroll-bar";
import { Price } from "@/components/course/price";
import { Rating, Stars } from "@/components/course/rating";
import { TrailerDialog } from "@/components/course/trailer-dialog";
import { BreadcrumbJsonLd, JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { courseDuration, flatLessons, toSummary } from "@/lib/course-utils";
import { courses, getCourse } from "@/lib/data/courses";
import { getInstructor } from "@/lib/data/instructors";
import { getReviews, ratingBreakdown } from "@/lib/data/reviews";
import { formatDate, formatDuration, formatNumber, initials } from "@/lib/format";
import { localizedUrl, pageMetadata } from "@/lib/seo";
import { siteConfig, getSiteUrl } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => courses.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/courses/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = getCourse(slug);
  if (!hasLocale(routing.locales, locale) || !course) return {};
  return pageMetadata({
    locale,
    path: `/courses/${slug}`,
    title: course.title[locale],
    description: course.subtitle[locale],
  });
}

export default async function CoursePage({ params }: PageProps<"/[locale]/courses/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const course = getCourse(slug);
  if (!course) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("Course");
  const tc = await getTranslations("Common");
  const tcat = await getTranslations("Catalog");
  const instructor = getInstructor(course.instructorId);
  const lessons = flatLessons(course);
  const duration = courseDuration(course);
  const articles = lessons.filter((l) => l.type === "article").length;
  const reviews = getReviews(course.slug);
  const breakdown = ratingBreakdown(course.rating);
  const related = courses
    .filter((c) => c.slug !== course.slug && c.category === course.category)
    .concat(courses.filter((c) => c.slug !== course.slug && c.category !== course.category && c.bestseller))
    .slice(0, 3)
    .map(toSummary);
  const title = course.title[locale];
  const url = localizedUrl(locale, `/courses/${slug}`);

  const includes = [
    { icon: PlayCircleIcon, label: t("includesVideo", { duration: formatDuration(duration) }) },
    { icon: FileTextIcon, label: t("includesArticles", { count: articles }) },
    { icon: ClipboardCheckIcon, label: t("includesQuiz") },
    { icon: AwardIcon, label: t("includesCertificate") },
    { icon: InfinityIcon, label: t("includesAccess") },
    { icon: MonitorSmartphoneIcon, label: t("includesDevices") },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          "@id": `${url}#course`,
          name: title,
          description: course.description[locale],
          url,
          image: course.image,
          inLanguage: course.language,
          educationalLevel: course.level,
          timeRequired: `PT${Math.floor(duration / 60)}H${duration % 60}M`,
          provider: { "@type": "Organization", name: siteConfig.name, sameAs: getSiteUrl() },
          author: instructor ? { "@type": "Person", name: instructor.name } : undefined,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: course.rating,
            ratingCount: course.ratingCount,
            bestRating: 5,
          },
          offers: {
            "@type": "Offer",
            category: course.price === 0 ? "Free" : "Paid",
            price: course.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url,
          },
          hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            courseWorkload: `PT${Math.floor(duration / 60)}H${duration % 60}M`,
            instructor: instructor ? { "@type": "Person", name: instructor.name } : undefined,
          },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: tcat("breadcrumbHome"), url: localizedUrl(locale) },
          { name: t("breadcrumbCourses"), url: localizedUrl(locale, "/courses") },
          { name: tc(`category.${course.category}`), url: localizedUrl(locale, `/courses?category=${course.category}`) },
          { name: title, url },
        ]}
      />

      <section className="relative overflow-hidden bg-[oklch(0.22_0.07_282)] text-white">
        <div aria-hidden="true" className="absolute -top-32 right-0 size-96 rounded-full bg-primary/50 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-40 left-1/3 size-80 rounded-full bg-coral/20 blur-3xl" />
        <div className="relative container-page grid gap-8 py-10 lg:grid-cols-[1fr_380px] lg:gap-12 lg:py-14">
          <div className="flex flex-col gap-4 [&_nav_*]:text-white/75 [&_nav_[aria-current]]:text-white">
            <Breadcrumbs
              items={[
                { label: t("breadcrumbCourses"), href: "/courses" },
                { label: tc(`category.${course.category}`), href: `/courses?category=${course.category}` },
                { label: title },
              ]}
            />
            <div className="flex flex-wrap gap-2">
              {course.bestseller ? <Badge className="bg-star text-foreground">{tc("bestseller")}</Badge> : null}
              {course.isNew ? <Badge className="bg-coral text-foreground">{tc("new")}</Badge> : null}
              <Badge variant="outline" className="border-white/25 text-white">
                {tc(`level.${course.level}`)}
              </Badge>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">{title}</h1>
            <p className="max-w-2xl text-lg text-white/85">{course.subtitle[locale]}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85 [&_.text-muted-foreground]:text-white/70 [&_.text-foreground]:text-white">
              <Rating rating={course.rating} count={course.ratingCount} />
              <span className="inline-flex items-center gap-1.5">
                <UsersIcon aria-hidden="true" className="size-4" />
                {t("studentsCount", { count: formatNumber(course.students, locale) })}
              </span>
            </div>
            {instructor ? (
              <p className="text-sm text-white/85">
                {t("createdBy")}{" "}
                <Link
                  href={`/instructors/${instructor.slug}`}
                  className="font-medium text-white underline underline-offset-4 hover:no-underline"
                >
                  {instructor.name}
                </Link>
              </p>
            ) : null}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon aria-hidden="true" className="size-4" />
                {t("updated", { date: formatDate(course.updated, locale) })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GlobeIcon aria-hidden="true" className="size-4" />
                {t("taughtIn", { language: tc(`language.${course.language}`) })}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-10 pt-8 pb-28 lg:grid-cols-[1fr_380px] lg:gap-12 lg:pb-20">
        <aside className="order-first lg:order-none lg:col-start-2 lg:row-start-1">
          <div className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-xl shadow-primary/5 lg:sticky lg:top-24 lg:-mt-80">
            <TrailerDialog poster={course.image} title={title} />
            <Price price={course.price} originalPrice={course.originalPrice} size="lg" />
            <EnrollActions
              slug={course.slug}
              title={title}
              price={course.price}
              firstLessonId={lessons[0].id}
            />
            <GuaranteeAndShare />
            <div>
              <h2 className="text-sm font-semibold">{t("includes")}</h2>
              <ul className="mt-3 flex flex-col gap-2.5">
                {includes.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Icon aria-hidden="true" className="size-4 shrink-0 text-foreground" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-12 lg:col-start-1 lg:row-start-1">
          <section aria-labelledby="learn-title" className="rounded-2xl border bg-card p-6">
            <h2 id="learn-title" className="text-xl font-semibold">
              {t("learnTitle")}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o.en} className="flex items-start gap-2.5 text-sm">
                  <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  {o[locale]}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="curriculum-title">
            <h2 id="curriculum-title" className="mb-2 text-2xl font-semibold tracking-tight">
              {t("curriculumTitle")}
            </h2>
            <Curriculum modules={course.modules} poster={course.image} quizQuestions={course.quiz.questions.length} />
          </section>

          <section aria-labelledby="requirements-title">
            <h2 id="requirements-title" className="text-2xl font-semibold tracking-tight">
              {t("requirementsTitle")}
            </h2>
            <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-muted-foreground marker:text-primary">
              {course.requirements.map((r) => (
                <li key={r.en}>{r[locale]}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="description-title">
            <h2 id="description-title" className="text-2xl font-semibold tracking-tight">
              {t("descriptionTitle")}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-pretty text-muted-foreground">
              {course.description[locale]}
            </p>
          </section>

          {instructor ? (
            <section aria-labelledby="instructor-title">
              <h2 id="instructor-title" className="text-2xl font-semibold tracking-tight">
                {t("instructorTitle")}
              </h2>
              <div className="mt-5 flex flex-col gap-5 rounded-2xl border bg-card p-6 sm:flex-row">
                <Image
                  src={instructor.avatar}
                  alt=""
                  width={96}
                  height={96}
                  className="size-24 shrink-0 rounded-2xl object-cover"
                />
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold">
                    <Link href={`/instructors/${instructor.slug}`} className="hover:text-primary">
                      {instructor.name}
                    </Link>
                  </p>
                  <p className="text-sm text-muted-foreground">{instructor.role[locale]}</p>
                  <p className="text-sm leading-relaxed text-pretty">{instructor.bio[locale]}</p>
                  <Link
                    href={`/instructors/${instructor.slug}`}
                    className="mt-1 self-start text-sm font-medium text-primary hover:underline"
                  >
                    {t("viewProfile")}
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          <section aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="text-2xl font-semibold tracking-tight">
              {t("reviewsTitle")}
            </h2>
            <div className="mt-5 grid gap-6 rounded-2xl border bg-card p-6 sm:grid-cols-[180px_1fr]">
              <div className="flex flex-col items-center justify-center gap-1 text-center">
                <p className="text-5xl font-semibold tracking-tight text-primary">{course.rating.toFixed(1)}</p>
                <Stars rating={course.rating} />
                <p className="mt-1 text-sm text-muted-foreground">{t("ratingOutOf")}</p>
              </div>
              <ul className="flex flex-col gap-2">
                {breakdown.map((percent, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="sr-only">{t("starsPercent", { stars: 5 - i, percent })}</span>
                    <span aria-hidden="true" className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <span className="block h-full rounded-full bg-star" style={{ width: `${percent}%` }} />
                    </span>
                    <span aria-hidden="true" className="w-16 text-xs text-muted-foreground">
                      {5 - i} ★ · {percent}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {reviews.map((review) => (
                <li key={review.id} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-3">
                    {review.avatar ? (
                      <Image
                        src={review.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="grid size-10 place-items-center rounded-full bg-secondary text-sm font-semibold text-primary">
                        {initials(review.name)}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-semibold">{review.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.location} · {formatDate(review.date, locale, "short")}
                      </p>
                    </div>
                  </div>
                  <Rating rating={review.rating} className="mt-3" />
                  <p className="mt-2 text-sm leading-relaxed text-pretty">{review.body[locale]}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="related-title" className="border-t bg-card/70 py-16">
          <div className="container-page">
            <h2 id="related-title" className="text-2xl font-semibold tracking-tight">
              {t("relatedTitle")}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <MobileEnrollBar
        slug={course.slug}
        title={title}
        price={course.price}
        originalPrice={course.originalPrice}
        firstLessonId={lessons[0].id}
      />
    </>
  );
}
