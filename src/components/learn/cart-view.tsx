"use client";

import { BookmarkIcon, LockIcon, ShoppingCartIcon, TagIcon, Trash2Icon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { formatPrice } from "@/lib/format";
import { COUPONS, orderTotals, useCommerce } from "@/lib/store/commerce";
import { useLearning } from "@/lib/store/learning";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CourseLineItem } from "./course-line-item";

export function OrderSummary({
  subtotal,
  coupon,
  children,
  className,
}: {
  subtotal: number;
  coupon: string | null;
  children?: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const totals = orderTotals(subtotal, coupon);
  return (
    <section aria-labelledby="order-summary" className={cn("rounded-3xl border bg-card p-6", className)}>
      <h2 id="order-summary" className="text-lg font-semibold">
        {t("summary")}
      </h2>
      <dl className="mt-4 flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("subtotal")}</dt>
          <dd className="tabular-nums">{formatPrice(totals.subtotal, locale, { cents: true })}</dd>
        </div>
        {totals.discount > 0 && coupon ? (
          <div className="flex justify-between text-success">
            <dt>{t("discount", { code: coupon })}</dt>
            <dd className="tabular-nums">−{formatPrice(totals.discount, locale, { cents: true })}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t("tax")}</dt>
          <dd className="tabular-nums">{formatPrice(totals.tax, locale, { cents: true })}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t pt-3 text-base font-semibold">
          <dt>{t("total")}</dt>
          <dd className="tabular-nums">{formatPrice(totals.total, locale, { cents: true })}</dd>
        </div>
      </dl>
      {children}
    </section>
  );
}

function CouponForm() {
  const t = useTranslations("Cart");
  const id = useId();
  const coupon = useCommerce((s) => s.coupon);
  const applyCoupon = useCommerce((s) => s.applyCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (coupon) {
    return (
      <div className="mt-5 flex items-center justify-between rounded-xl bg-success/10 px-3 py-2 text-sm">
        <span className="inline-flex items-center gap-2 font-medium text-success">
          <TagIcon aria-hidden="true" className="size-4" />
          {coupon}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t("removeCoupon")}
          onClick={() => applyCoupon(null)}
        >
          <XIcon aria-hidden="true" />
        </Button>
      </div>
    );
  }

  return (
    <form
      className="mt-5"
      onSubmit={(e) => {
        e.preventDefault();
        const normalized = code.trim().toUpperCase();
        if (COUPONS[normalized] === undefined) {
          setError(true);
          return;
        }
        applyCoupon(normalized);
        setCode("");
        setError(false);
        toast.success(t("couponApplied", { code: normalized }));
      }}
    >
      <label htmlFor={id} className="text-sm font-medium">
        {t("coupon")}
      </label>
      <div className="mt-1.5 flex gap-2">
        <Input
          id={id}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          autoComplete="off"
          aria-invalid={error || undefined}
          aria-describedby={`${id}-hint`}
          className="uppercase placeholder:normal-case"
          placeholder="LEARN20"
        />
        <Button type="submit" variant="outline" disabled={!code.trim()}>
          {t("apply")}
        </Button>
      </div>
      <p
        id={`${id}-hint`}
        className={cn("mt-1.5 text-xs", error ? "text-destructive" : "text-muted-foreground")}
      >
        {error ? t("couponInvalid") : t("couponHint")}
      </p>
    </form>
  );
}

export function CartView() {
  const t = useTranslations("Cart");
  const locale = useLocale() as Locale;
  const cart = useCommerce((s) => s.cart);
  const coupon = useCommerce((s) => s.coupon);
  const removeFromCart = useCommerce((s) => s.removeFromCart);
  const toggleWishlist = useCommerce((s) => s.toggleWishlist);
  const wishlist = useCommerce((s) => s.wishlist);
  const enrollments = useLearning((s) => s.enrollments);

  const courses = cart.map(getCourse).filter((c): c is Course => Boolean(c));
  const payable = courses.filter((c) => !enrollments[c.slug]);
  const subtotal = payable.reduce((sum, c) => sum + c.price, 0);

  function saveForLater(course: Course) {
    if (!wishlist.includes(course.slug)) toggleWishlist(course.slug);
    removeFromCart(course.slug);
    toast.success(t("savedForLater"), { description: course.title[locale] });
  }

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={courses.length ? t("count", { count: courses.length }) : undefined}
      />
      {courses.length === 0 ? (
        <EmptyState
          icon={ShoppingCartIcon}
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={{ label: t("emptyCta"), href: "/courses" }}
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start">
          <ul className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {courses.map((course) => (
                <motion.li
                  key={course.slug}
                  layout
                  exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                >
                  <CourseLineItem course={course}>
                    {enrollments[course.slug] ? (
                      <Badge variant="secondary">{t("alreadyEnrolled")}</Badge>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveForLater(course)}
                      aria-label={`${t("saveForLater")}: ${course.title[locale]}`}
                    >
                      <BookmarkIcon aria-hidden="true" />
                      <span className="hidden sm:inline">{t("saveForLater")}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(course.slug)}
                      aria-label={`${t("remove")}: ${course.title[locale]}`}
                    >
                      <Trash2Icon aria-hidden="true" />
                      <span className="hidden sm:inline">{t("remove")}</span>
                    </Button>
                  </CourseLineItem>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <OrderSummary subtotal={subtotal} coupon={coupon} className="xl:sticky xl:top-24">
            <CouponForm />
            {payable.length ? (
              <Link href="/learn/checkout" className={cn(buttonVariants({ size: "xl" }), "mt-5 w-full")}>
                <LockIcon aria-hidden="true" />
                {t("checkout")}
              </Link>
            ) : (
              <Button size="xl" className="mt-5 w-full" disabled>
                {t("checkout")}
              </Button>
            )}
          </OrderSummary>
        </div>
      )}
    </div>
  );
}
