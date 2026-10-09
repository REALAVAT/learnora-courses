"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, CreditCardIcon, LockIcon, ShoppingCartIcon, SparklesIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { getPlan } from "@/lib/data/plans";
import { formatPrice } from "@/lib/format";
import { useAuth } from "@/lib/store/auth";
import { type Order, type OrderItem, orderTotals, useCommerce } from "@/lib/store/commerce";
import { useLearning } from "@/lib/store/learning";
import type { BillingCycle, Course, PlanId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OrderSummary } from "./cart-view";

function formatCard(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function expiryInFuture(value: string) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export function CheckoutView({ planId, cycle }: { planId?: string; cycle?: string }) {
  const t = useTranslations("Checkout");
  const tp = useTranslations("Pricing");
  const locale = useLocale() as Locale;
  const id = useId();
  const user = useAuth((s) => s.user);
  const cart = useCommerce((s) => s.cart);
  const coupon = useCommerce((s) => s.coupon);
  const placeOrder = useCommerce((s) => s.placeOrder);
  const clearCart = useCommerce((s) => s.clearCart);
  const enrollments = useLearning((s) => s.enrollments);
  const enroll = useLearning((s) => s.enroll);
  const setSubscription = useLearning((s) => s.setSubscription);
  const [order, setOrder] = useState<Order | null>(null);

  const plan = planId ? getPlan(planId) : undefined;
  const billing: BillingCycle = cycle === "yearly" ? "yearly" : "monthly";
  const planMode = Boolean(plan && plan.id !== "free");
  const courses = planMode
    ? []
    : cart
        .map(getCourse)
        .filter((c): c is Course => Boolean(c))
        .filter((c) => !enrollments[c.slug]);
  const items: OrderItem[] =
    planMode && plan
      ? [{ kind: "plan", plan: plan.id, cycle: billing, price: plan[billing] }]
      : courses.map((c) => ({ kind: "course", slug: c.slug, price: c.price }));
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const appliedCoupon = planMode ? null : coupon;
  const totals = orderTotals(subtotal, appliedCoupon);

  const schema = z.object({
    name: z.string().trim().min(2, t("errors.name")),
    email: z.string().trim().email(t("errors.email")),
    card: z
      .string()
      .transform((v) => v.replace(/\s/g, ""))
      .pipe(z.string().regex(/^\d{16}$/, t("errors.card"))),
    expiry: z.string().refine(expiryInFuture, t("errors.expiry")),
    cvc: z.string().regex(/^\d{3,4}$/, t("errors.cvc")),
    zip: z.string().regex(/^\d{5}$/, t("errors.zip")),
  });
  type FormIn = z.input<typeof schema>;
  type FormOut = z.output<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      card: "",
      expiry: "",
      cvc: "",
      zip: "",
    },
  });

  function fillTest() {
    const year = (new Date().getFullYear() + 3) % 100;
    setValue("card", "4242 4242 4242 4242", { shouldValidate: true });
    setValue("expiry", `12/${year}`, { shouldValidate: true });
    setValue("cvc", "123", { shouldValidate: true });
    setValue("zip", "10001", { shouldValidate: true });
  }

  async function onSubmit(values: FormOut) {
    await new Promise((r) => setTimeout(r, 1100));
    const placed = placeOrder({ items, ...totals, cardLast4: values.card.slice(-4) });
    if (planMode && plan) {
      setSubscription({ plan: plan.id, cycle: billing, since: new Date().toISOString() });
    } else {
      courses.forEach((c) => enroll(c.slug));
      clearCart();
    }
    setOrder(placed);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (order) {
    const planItem = order.items.find((i) => i.kind === "plan");
    const firstCourse = order.items.find((i) => i.kind === "course");
    return (
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        aria-live="polite"
        className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border bg-card px-6 py-12 text-center"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="grid size-16 place-items-center rounded-full bg-success text-white"
        >
          <CheckCircle2Icon aria-hidden="true" className="size-9" />
        </motion.span>
        <h1 className="mt-5 text-2xl font-semibold">{t("successTitle")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("successBody", { id: order.id, email: user?.email ?? "" })}
        </p>
        {planItem && planItem.kind === "plan" ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-soft px-3 py-1 text-sm font-medium text-primary">
            <SparklesIcon aria-hidden="true" className="size-4" />
            {t("successPlan", { plan: tp(`plan.${planItem.plan}`) })}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={
              firstCourse && firstCourse.kind === "course"
                ? `/learn/courses/${firstCourse.slug}/${getCourse(firstCourse.slug)?.modules[0].lessons[0].id}`
                : "/courses"
            }
            className={buttonVariants({ size: "xl" })}
          >
            {t("startLearning")}
          </Link>
          <Link href="/learn/orders" className={buttonVariants({ size: "xl", variant: "outline" })}>
            {t("viewOrders")}
          </Link>
        </div>
      </motion.section>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title={t("title")} />
        <EmptyState
          icon={ShoppingCartIcon}
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={{ label: t("emptyCta"), href: "/pricing" }}
        />
      </div>
    );
  }

  const field = (name: keyof FormIn) => ({
    id: `${id}-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });
  const formatted = (name: "card" | "expiry", format: (v: string) => string) => {
    const reg = register(name);
    return {
      ...reg,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = format(e.target.value);
        return reg.onChange(e);
      },
    };
  };
  const error = (name: keyof FormIn) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="text-sm text-destructive">
        {errors[name]?.message}
      </p>
    ) : null;

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={
          <span className="inline-flex items-center gap-1.5">
            <LockIcon aria-hidden="true" className="size-4 text-success" />
            {t("secure")}
          </span>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px] xl:items-start">
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <section aria-labelledby={`${id}-billing`} className="rounded-3xl border bg-card p-6">
            <h2 id={`${id}-billing`} className="text-lg font-semibold">
              {t("billing")}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${id}-name`}>{t("name")}</Label>
                <Input
                  {...field("name")}
                  autoComplete="cc-name"
                  className="h-11 rounded-xl"
                  {...register("name")}
                />
                {error("name")}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${id}-email`}>{t("email")}</Label>
                <Input
                  {...field("email")}
                  type="email"
                  autoComplete="email"
                  className="h-11 rounded-xl"
                  {...register("email")}
                />
                {error("email")}
              </div>
            </div>
          </section>

          <section aria-labelledby={`${id}-payment`} className="rounded-3xl border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id={`${id}-payment`} className="text-lg font-semibold">
                {t("payment")}
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={fillTest}>
                <CreditCardIcon aria-hidden="true" />
                {t("fillTest")}
              </Button>
            </div>
            <p className="mt-2 rounded-xl bg-indigo-soft px-3 py-2 text-sm text-primary">{t("testCard")}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-6">
              <div className="flex flex-col gap-2 sm:col-span-6">
                <Label htmlFor={`${id}-card`}>{t("card")}</Label>
                <Input
                  {...field("card")}
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  className="h-11 rounded-xl font-mono tracking-wider"
                  {...formatted("card", formatCard)}
                />
                {error("card")}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor={`${id}-expiry`}>{t("expiry")}</Label>
                <Input
                  {...field("expiry")}
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder={t("expiryPlaceholder")}
                  className="h-11 rounded-xl font-mono"
                  {...formatted("expiry", formatExpiry)}
                />
                {error("expiry")}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor={`${id}-cvc`}>{t("cvc")}</Label>
                <Input
                  {...field("cvc")}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  className="h-11 rounded-xl font-mono"
                  {...register("cvc")}
                />
                {error("cvc")}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor={`${id}-zip`}>{t("zip")}</Label>
                <Input
                  {...field("zip")}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  className="h-11 rounded-xl font-mono"
                  {...register("zip")}
                />
                {error("zip")}
              </div>
            </div>
          </section>

          <Button type="submit" size="xl" className="w-full xl:hidden" disabled={isSubmitting}>
            <LockIcon aria-hidden="true" />
            {isSubmitting
              ? t("processing")
              : t("pay", { amount: formatPrice(totals.total, locale, { cents: true }) })}
          </Button>
        </form>

        <div className="flex flex-col gap-4 xl:sticky xl:top-24">
          <ul className="flex flex-col gap-3 rounded-3xl border bg-card p-4">
            {planMode && plan ? (
              <li className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <SparklesIcon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium">
                  {t("planLine", {
                    plan: tp(`plan.${plan.id as PlanId}`),
                    cycle: billing === "yearly" ? t("cycleYearly") : t("cycleMonthly"),
                  })}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatPrice(plan[billing], locale)}
                </span>
              </li>
            ) : (
              courses.map((c) => (
                <li key={c.slug} className="flex items-center gap-3">
                  <span className="relative aspect-video w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image src={c.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="line-clamp-2 min-w-0 flex-1 text-sm font-medium">{c.title[locale]}</span>
                  <span className="text-sm font-semibold tabular-nums">{formatPrice(c.price, locale)}</span>
                </li>
              ))
            )}
          </ul>
          <OrderSummary subtotal={subtotal} coupon={appliedCoupon}>
            <Button
              type="button"
              size="xl"
              className={cn("mt-5 hidden w-full xl:flex")}
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              <LockIcon aria-hidden="true" />
              {isSubmitting
                ? t("processing")
                : t("pay", { amount: formatPrice(totals.total, locale, { cents: true }) })}
            </Button>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
