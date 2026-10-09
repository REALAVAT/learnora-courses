"use client";

import { CheckIcon, SparklesIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { plans } from "@/lib/data/plans";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/lib/store/auth";
import { useLearning } from "@/lib/store/learning";
import type { BillingCycle } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PricingPlans() {
  const t = useTranslations("Pricing");
  const locale = useLocale() as Locale;
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const mounted = useMounted();
  const user = useAuth((s) => s.user);
  const subscription = useLearning((s) => s.subscription);
  const currentPlan = mounted && user?.role === "student" ? (subscription?.plan ?? "free") : null;

  return (
    <div className="flex flex-col items-center gap-10">
      <div
        role="radiogroup"
        aria-label={t("billing")}
        className="inline-flex items-center gap-1 rounded-full border bg-card p-1 shadow-sm"
      >
        {(["monthly", "yearly"] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={cycle === c}
            onClick={() => setCycle(c)}
            className={cn(
              "relative inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              cycle === c ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {cycle === c ? (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
              />
            ) : null}
            <span className="relative">{t(c)}</span>
            {c === "yearly" ? (
              <span
                className={cn(
                  "relative rounded-full px-2 py-0.5 text-xs font-semibold",
                  cycle === c ? "bg-white/20 text-white" : "bg-coral-soft text-coral-strong",
                )}
              >
                {t("yearlySave")}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const yearly = cycle === "yearly";
          const price = yearly ? plan.yearly : plan.monthly;
          const isCurrent = currentPlan === plan.id;
          const href =
            plan.id === "free"
              ? user
                ? "/courses?price=free"
                : "/signup"
              : `/learn/checkout?plan=${plan.id}&cycle=${cycle}`;
          return (
            <article
              key={plan.id}
              aria-labelledby={`plan-${plan.id}`}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-card p-7 transition-shadow hover:shadow-lg",
                plan.highlighted &&
                  "border-primary/50 shadow-xl ring-2 shadow-primary/10 ring-primary/20 lg:-my-3 lg:py-10",
              )}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3.5 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <SparklesIcon aria-hidden="true" className="size-3.5" />
                  {t("mostPopular")}
                </span>
              ) : null}
              <div className="flex items-center justify-between gap-2">
                <h2 id={`plan-${plan.id}`} className="text-xl font-semibold">
                  {t(`plan.${plan.id}`)}
                </h2>
                {isCurrent ? (
                  <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                    {t("currentPlan")}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t(`planTagline.${plan.id}`)}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span
                  key={`${plan.id}-${cycle}`}
                  className={cn(
                    "text-5xl font-semibold tracking-tight",
                    yearly && "animate-in duration-300 fade-in slide-in-from-bottom-1",
                  )}
                >
                  {formatPrice(price, locale)}
                </span>
                {plan.id !== "free" ? (
                  <span className="text-muted-foreground">
                    {yearly ? t("perYear") : t("perMonth")}
                    {plan.id === "business" ? ` · ${t("perSeat")}` : null}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 h-5 text-sm text-muted-foreground">
                {plan.id === "free"
                  ? t("forever")
                  : yearly
                    ? t("billedYearly", {
                        amount: formatPrice(Math.round((plan.yearly / 12) * 100) / 100, locale),
                      })
                    : t("billedMonthly")}
              </p>
              <Link
                href={href}
                className={cn(
                  buttonVariants({ variant: plan.highlighted ? "default" : "outline", size: "xl" }),
                  "mt-6 w-full",
                )}
              >
                {t(`cta.${plan.id}`)}
              </Link>
              <ul className="mt-7 flex flex-col gap-3 border-t pt-6">
                {plan.features.map((f) => (
                  <li key={f.en} className="flex items-start gap-2.5 text-sm">
                    <CheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                    {f[locale]}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
