"use client";

import { CheckCircle2Icon, Share2Icon, ShieldCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/store/auth";
import { useCommerce } from "@/lib/store/commerce";
import { useLearning } from "@/lib/store/learning";
import { cn } from "@/lib/utils";
import { WishlistButton } from "./wishlist-button";

export function useEnroll(slug: string, price: number, firstLessonId: string) {
  const t = useTranslations("Course");
  const tc = useTranslations("Common");
  const router = useRouter();
  const mounted = useMounted();
  const user = useAuth((s) => s.user);
  const enrollment = useLearning((s) => s.enrollments[slug]);
  const subscription = useLearning((s) => s.subscription);
  const enroll = useLearning((s) => s.enroll);
  const inCart = useCommerce((s) => s.cart.includes(slug));
  const addToCart = useCommerce((s) => s.addToCart);

  const hasPlan = Boolean(subscription && subscription.plan !== "free");
  const playerHref = `/learn/courses/${slug}/${enrollment?.lastLessonId ?? firstLessonId}`;

  function requireStudent() {
    if (!user) {
      toast.info(t("loginToEnroll"));
      router.push(`/login?next=${encodeURIComponent(`/courses/${slug}`)}`);
      return false;
    }
    if (user.role !== "student") {
      toast.info(t("instructorCannotEnroll"));
      return false;
    }
    return true;
  }

  return {
    mounted,
    enrolled: mounted && Boolean(enrollment),
    inCart: mounted && inCart,
    hasPlan: mounted && hasPlan,
    planName: subscription?.plan === "business" ? "Business" : "Pro",
    goToCourse: () => router.push(playerHref),
    enrollNow: () => {
      if (!requireStudent()) return;
      enroll(slug);
      toast.success(t("enrolledToast"));
      router.push(`/learn/courses/${slug}/${firstLessonId}`);
    },
    addToCart: () => {
      addToCart(slug);
      toast.success(tc("addedToCart"));
    },
    goToCart: () => router.push("/learn/cart"),
    buyNow: () => {
      addToCart(slug);
      router.push("/learn/checkout");
    },
    isFree: price === 0,
  };
}

export function EnrollActions({
  slug,
  title,
  price,
  firstLessonId,
  className,
  compact,
}: {
  slug: string;
  title: string;
  price: number;
  firstLessonId: string;
  className?: string;
  compact?: boolean;
}) {
  const t = useTranslations("Course");
  const e = useEnroll(slug, price, firstLessonId);

  if (!e.mounted) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <Skeleton className="h-11 w-full rounded-xl" />
        {!compact ? <Skeleton className="h-11 w-full rounded-xl" /> : null}
      </div>
    );
  }

  if (e.enrolled) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {!compact ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-success">
            <CheckCircle2Icon aria-hidden="true" className="size-4" />
            {t("enrolled")}
          </p>
        ) : null}
        <Button size="xl" className="w-full" onClick={e.goToCourse}>
          {t("continueLearning")}
        </Button>
      </div>
    );
  }

  if (e.isFree || e.hasPlan) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <Button size="xl" className="w-full" onClick={e.enrollNow}>
          {e.isFree ? t("enrollFree") : t("enrollWithPlan", { plan: e.planName })}
        </Button>
        {!compact ? <WishlistButton slug={slug} title={title} withLabel className="w-full" /> : null}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2", compact ? "flex-row" : "flex-col", className)}>
      {e.inCart ? (
        <Button size="xl" className={compact ? "flex-1" : "w-full"} onClick={e.goToCart}>
          {t("goToCart")}
        </Button>
      ) : (
        <Button size="xl" className={compact ? "flex-1" : "w-full"} onClick={e.addToCart}>
          {t("addToCart")}
        </Button>
      )}
      {!compact ? (
        <>
          <Button size="xl" variant="outline" className={compact ? "flex-1" : "w-full"} onClick={e.buyNow}>
            {t("buyNow")}
          </Button>
          <WishlistButton slug={slug} title={title} withLabel className="w-full" />
        </>
      ) : null}
    </div>
  );
}

export function GuaranteeAndShare() {
  const t = useTranslations("Course");
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <ShieldCheckIcon aria-hidden="true" className="size-4 text-success" />
        {t("moneyBack")}
      </span>
      <button
        type="button"
        onClick={async () => {
          const url = window.location.href;
          try {
            if (navigator.share) await navigator.share({ url, title: document.title });
            else {
              await navigator.clipboard.writeText(url);
              toast.success(t("linkCopied"));
            }
          } catch {
            /* share sheet dismissed */
          }
        }}
        className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
      >
        <Share2Icon aria-hidden="true" className="size-4" />
        {t("share")}
      </button>
    </div>
  );
}
