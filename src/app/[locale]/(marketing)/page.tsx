import {
  ArrowRightIcon,
  AwardIcon,
  CheckIcon,
  FlameIcon,
  HammerIcon,
  PlayIcon,
  QuoteIcon,
  SmartphoneIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/course/course-card";
import { JsonLd } from "@/components/json-ld";
import { HeroSearch } from "@/components/marketing/hero-search";
import { InstructorCard } from "@/components/marketing/instructor-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { toSummary } from "@/lib/course-utils";
import { categories } from "@/lib/data/categories";
import { courses } from "@/lib/data/courses";
import { instructors } from "@/lib/data/instructors";
import { plans } from "@/lib/data/plans";
import { testimonials } from "@/lib/data/testimonials";
import { formatPrice } from "@/lib/format";
import { images } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return pageMetadata({ locale, path: "", description: t("description") });
}

const trusted = ["Northwind", "Brightline", "Quanta", "Fieldwork", "Harbor & Co", "Lumen Labs"];
const faqKeys = ["1", "2", "3", "4", "5", "6"] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const tc = await getTranslations("Common");

  const featured = courses
    .filter((c) => c.featured)
    .slice(0, 4)
    .map(toSummary);
  const countByCategory = (id: string) => courses.filter((c) => c.category === id).length;

  const why = [
    { key: "projects", icon: HammerIcon },
    { key: "anywhere", icon: SmartphoneIcon },
    { key: "credentials", icon: AwardIcon },
    { key: "instructors", icon: UsersIcon },
  ] as const;

  const [titleBefore, titleAfter] = t("title").split(t("titleAccent"));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqKeys.map((k) => ({
            "@type": "Question",
            name: t(`faq.q${k}`),
            acceptedAnswer: { "@type": "Answer", text: t(`faq.a${k}`) },
          })),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -top-40 right-[-10%] -z-10 size-[36rem] rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute top-60 left-[-15%] -z-10 size-[28rem] rounded-full bg-coral/20 blur-3xl"
        />
        <div className="container-page grid items-center gap-12 pt-12 pb-16 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pt-20 lg:pb-24">
          <div className="flex flex-col gap-7">
            <Link
              href="/courses/practical-ai-for-professionals"
              className="inline-flex items-center gap-2 self-start rounded-full border bg-card py-1 pr-3 pl-1 text-sm shadow-sm transition-colors hover:border-primary/40"
            >
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                <SparklesIcon aria-hidden="true" className="size-3" />
                {tc("new")}
              </span>
              <span className="text-muted-foreground">{t("eyebrow")}</span>
              <ArrowRightIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
            </Link>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {titleBefore}
              <span className="relative whitespace-nowrap text-primary">
                {t("titleAccent")}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 h-3 w-full text-coral"
                >
                  <path
                    d="M2 9c40-6 120-8 196-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {titleAfter}
            </h1>
            <p className="max-w-xl text-lg text-pretty text-muted-foreground">{t("subtitle")}</p>
            <HeroSearch />
            <dl className="grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 pt-2 sm:grid-cols-4">
              {[
                ["250k+", t("stats.learners")],
                ["600+", t("stats.courses")],
                ["4.8", t("stats.rating")],
                ["140+", t("stats.countries")],
              ].map(([value, label]) => (
                <div key={label} className="flex flex-col-reverse justify-end">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-2xl font-semibold tracking-tight">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Reveal className="relative mx-auto w-full max-w-xl lg:max-w-none" y={28}>
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] border bg-muted shadow-2xl shadow-primary/15 sm:aspect-[5/4.4]">
              <Image
                src={images.hero}
                alt=""
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 560px, 92vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
              <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-primary shadow-xl backdrop-blur">
                <PlayIcon aria-hidden="true" className="ml-1 size-6 fill-current" />
              </span>
            </div>
            <div className="absolute -bottom-6 -left-2 w-64 rounded-2xl border bg-card p-4 shadow-xl sm:-left-8">
              <p className="text-xs font-medium text-muted-foreground">{t("heroCard.continue")}</p>
              <p className="mt-1 text-sm font-semibold">{courses[3].title[locale]}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[68%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t("heroCard.lesson")}</p>
            </div>
            <div className="absolute -top-5 right-2 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 shadow-xl sm:-right-6">
              <span className="grid size-9 place-items-center rounded-xl bg-coral-soft text-coral-strong">
                <AwardIcon aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold">{t("heroCard.certificate")}</p>
                <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <FlameIcon aria-hidden="true" className="size-3.5 text-coral-strong" />
                  {t("heroCard.streak")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="border-y bg-card/60">
          <div className="container-page flex flex-col items-center gap-4 py-7 lg:flex-row lg:justify-between">
            <p className="text-sm text-muted-foreground">{t("trusted")}</p>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {trusted.map((name) => (
                <li key={name} className="text-lg font-semibold tracking-tight text-foreground/55">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories-title" className="container-page py-20 lg:py-24">
        <SectionHeading
          id="categories-title"
          title={t("categoriesTitle")}
          subtitle={t("categoriesSubtitle")}
        />
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => (
            <li key={cat.id}>
              <Reveal delay={i * 0.05}>
                <Link
                  href={`/courses?category=${cat.id}`}
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-muted p-4 text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
                >
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 200px, (min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:group-hover:scale-100"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  <span className="relative text-base font-semibold">{tc(`category.${cat.id}`)}</span>
                  <span className="relative mt-0.5 text-xs text-white/85">{cat.description[locale]}</span>
                  <span className="relative mt-2 text-xs font-medium text-white/90">
                    {tc("courses", { count: countByCategory(cat.id) })}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured */}
      <section aria-labelledby="featured-title" className="bg-card/70 py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            id="featured-title"
            title={t("featuredTitle")}
            subtitle={t("featuredSubtitle")}
            action={
              <Link
                href="/courses"
                className={cn(buttonVariants({ variant: "outline", size: "xl" }), "self-start")}
              >
                {t("browseAll")}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((course, i) => (
              <Reveal key={course.slug} delay={i * 0.06} className="flex">
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section aria-labelledby="why-title" className="container-page py-20 lg:py-24">
        <SectionHeading id="why-title" title={t("whyTitle")} align="center" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {why.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} delay={i * 0.06}>
              <div className="h-full rounded-2xl border bg-card p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-indigo-soft text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{t(`why.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`why.${key}.body`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section aria-labelledby="instructors-title" className="bg-card/70 py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            id="instructors-title"
            title={t("instructorsTitle")}
            subtitle={t("instructorsSubtitle")}
            action={
              <Link
                href="/instructors"
                className={cn(buttonVariants({ variant: "outline", size: "xl" }), "self-start")}
              >
                {t("meetAll")}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.slice(0, 4).map((instructor, i) => (
              <Reveal key={instructor.slug} delay={i * 0.06}>
                <InstructorCard instructor={instructor} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section aria-labelledby="testimonials-title" className="container-page py-20 lg:py-24">
        <SectionHeading
          id="testimonials-title"
          title={t("testimonialsTitle")}
          subtitle={t("testimonialsSubtitle")}
          align="center"
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-7">
                <QuoteIcon aria-hidden="true" className="size-7 text-coral" />
                <blockquote className="mt-4 flex-1 text-base leading-relaxed text-pretty">
                  “{item.quote[locale]}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <Image
                    src={item.avatar}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.role[locale]}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section aria-labelledby="pricing-title" className="bg-card/70 py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            id="pricing-title"
            title={t("pricingTitle")}
            subtitle={t("pricingSubtitle")}
            action={
              <Link
                href="/pricing"
                className={cn(buttonVariants({ variant: "outline", size: "xl" }), "self-start")}
              >
                {t("comparePlans")}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-2xl border bg-card p-6",
                  plan.highlighted && "border-primary/40 ring-2 ring-primary/15",
                )}
              >
                <h3 className="text-lg font-semibold capitalize">
                  {plan.id === "free" ? tc("free") : plan.id}
                </h3>
                <p className="mt-3">
                  <span className="text-4xl font-semibold tracking-tight">
                    {formatPrice(plan.monthly, locale)}
                  </span>
                  <span className="text-muted-foreground">{t("perMonth")}</span>
                </p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {plan.features.slice(0, 3).map((f) => (
                    <li key={f.en} className="flex items-start gap-2 text-sm">
                      <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                      {f[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        aria-labelledby="faq-title"
        className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_1.6fr] lg:py-24"
      >
        <SectionHeading id="faq-title" title={t("faqTitle")} />
        <Accordion className="rounded-2xl border bg-card px-5">
          {faqKeys.map((k) => (
            <AccordionItem key={k} value={k}>
              <AccordionTrigger className="py-4 text-base">{t(`faq.q${k}`)}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                {t(`faq.a${k}`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="container-page pb-20 lg:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12 lg:py-20">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 size-80 rounded-full bg-coral/40 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-20 size-80 rounded-full bg-white/10 blur-3xl"
            />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
              {t("ctaBody")}
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className={cn(buttonVariants({ size: "xl" }), "bg-white text-primary hover:bg-white/90")}
              >
                {t("ctaPrimary")}
              </Link>
              <Link
                href="/courses"
                className={cn(
                  buttonVariants({ variant: "outline", size: "xl" }),
                  "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white",
                )}
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
