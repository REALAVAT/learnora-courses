"use client";

import { HeartIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { useCommerce } from "@/lib/store/commerce";
import { useLearning } from "@/lib/store/learning";
import type { Course } from "@/lib/types";
import { CourseLineItem } from "./course-line-item";

export function WishlistView() {
  const t = useTranslations("Wishlist");
  const tc = useTranslations("Cart");
  const tl = useTranslations("Learn");
  const tcourse = useTranslations("Course");
  const locale = useLocale() as Locale;
  const wishlist = useCommerce((s) => s.wishlist);
  const cart = useCommerce((s) => s.cart);
  const addToCart = useCommerce((s) => s.addToCart);
  const removeFromWishlist = useCommerce((s) => s.removeFromWishlist);
  const enrollments = useLearning((s) => s.enrollments);
  const subscription = useLearning((s) => s.subscription);
  const tp = useTranslations("Pricing");
  const planName = subscription && subscription.plan !== "free" ? tp(`plan.${subscription.plan}`) : null;

  const courses = wishlist.map(getCourse).filter((c): c is Course => Boolean(c));

  function moveToCart(course: Course) {
    addToCart(course.slug);
    removeFromWishlist(course.slug);
    toast.success(t("movedToCart"), { description: course.title[locale] });
  }

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {courses.length === 0 ? (
        <EmptyState
          icon={HeartIcon}
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={{ label: t("emptyCta"), href: "/courses" }}
        />
      ) : (
        <ul className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {courses.map((course) => {
              const enrolled = Boolean(enrollments[course.slug]);
              return (
                <motion.li
                  key={course.slug}
                  layout
                  exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                >
                  <CourseLineItem course={course}>
                    {enrolled ? (
                      <Link
                        href={`/learn/courses`}
                        className={buttonVariants({ size: "sm", variant: "secondary" })}
                      >
                        {tl("nav.courses")}
                      </Link>
                    ) : cart.includes(course.slug) ? (
                      <Link
                        href="/learn/cart"
                        className={buttonVariants({ size: "sm", variant: "secondary" })}
                      >
                        {tc("title")}
                      </Link>
                    ) : planName ? (
                      <Link href={`/courses/${course.slug}`} className={buttonVariants({ size: "sm" })}>
                        {tcourse("enrollWithPlan", { plan: planName })}
                      </Link>
                    ) : course.price > 0 ? (
                      <Button size="sm" onClick={() => moveToCart(course)}>
                        <ShoppingCartIcon aria-hidden="true" />
                        {t("moveToCart")}
                      </Button>
                    ) : (
                      <Link
                        href={`/courses/${course.slug}`}
                        className={buttonVariants({ size: "sm", variant: "secondary" })}
                      >
                        {tcourse("enrollFree")}
                      </Link>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromWishlist(course.slug)}
                      aria-label={`${t("remove")}: ${course.title[locale]}`}
                    >
                      <Trash2Icon aria-hidden="true" />
                      <span className="hidden sm:inline">{t("remove")}</span>
                    </Button>
                  </CourseLineItem>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
