import { CheckIcon, MinusIcon } from "lucide-react";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd, JsonLd } from "@/components/json-ld";
import { PricingPlans } from "@/components/marketing/pricing-plans";
import { TeamsCta } from "@/components/marketing/teams-cta";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { routing } from "@/i18n/routing";
import { plans } from "@/lib/data/plans";
import { localizedUrl, pageMetadata } from "@/lib/seo";
import type { PlanId } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/[locale]/pricing">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return pageMetadata({ locale, path: "/pricing", title: t("metaTitle"), description: t("metaDescription") });
}

const comparison: { key: string; plans: PlanId[] }[] = [
  { key: "freeCourses", plans: ["free", "pro", "business"] },
  { key: "allCourses", plans: ["pro", "business"] },
  { key: "certificates", plans: ["pro", "business"] },
  { key: "quizzes", plans: ["pro", "business"] },
  { key: "offline", plans: ["pro", "business"] },
  { key: "qa", plans: ["free", "pro", "business"] },
  { key: "team", plans: ["business"] },
  { key: "sso", plans: ["business"] },
  { key: "manager", plans: ["business"] },
];

const faqKeys = ["1", "2", "3", "4"] as const;

export default async function PricingPage({ params }: PageProps<"/[locale]/pricing">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Pricing");
  const tcat = await getTranslations("Catalog");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tcat("breadcrumbHome"), url: localizedUrl(locale) },
          { name: t("metaTitle"), url: localizedUrl(locale, "/pricing") },
        ]}
      />
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

      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[28rem] bg-grid opacity-60" />
        <div className="relative container-page pt-14 pb-16 lg:pt-20">
          <header className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">{t("eyebrow")}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
          </header>
          <PricingPlans />
        </div>
      </section>

      <section aria-labelledby="compare-title" className="container-page py-12">
        <h2 id="compare-title" className="text-2xl font-semibold tracking-tight">
          {t("compareTitle")}
        </h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th scope="col" className="px-5 py-4 text-left font-semibold">
                  {t("feature")}
                </th>
                {plans.map((p) => (
                  <th key={p.id} scope="col" className="px-5 py-4 text-center font-semibold">
                    {t(`plan.${p.id}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.key} className="border-b last:border-b-0">
                  <th scope="row" className="px-5 py-3.5 text-left font-normal">
                    {t(`rows.${row.key}` as "rows.freeCourses")}
                  </th>
                  {plans.map((p) => (
                    <td key={p.id} className="px-5 py-3.5 text-center">
                      {row.plans.includes(p.id) ? (
                        <>
                          <CheckIcon aria-hidden="true" className="mx-auto size-5 text-success" />
                          <span className="sr-only">{t("included")}</span>
                        </>
                      ) : (
                        <>
                          <MinusIcon aria-hidden="true" className="mx-auto size-5 text-muted-foreground/60" />
                          <span className="sr-only">{t("notIncluded")}</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        aria-labelledby="pricing-faq-title"
        className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.6fr]"
      >
        <h2 id="pricing-faq-title" className="text-2xl font-semibold tracking-tight">
          {t("faqTitle")}
        </h2>
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

      <section className="container-page pt-4 pb-20">
        <TeamsCta />
      </section>
    </>
  );
}
