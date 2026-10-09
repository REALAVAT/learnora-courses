"use client";

import { HeartIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useMounted } from "@/hooks/use-mounted";
import { useCommerce } from "@/lib/store/commerce";
import { cn } from "@/lib/utils";

export function WishlistButton({
  slug,
  title,
  className,
  withLabel,
}: {
  slug: string;
  title: string;
  className?: string;
  withLabel?: boolean;
}) {
  const t = useTranslations("Common");
  const mounted = useMounted();
  const saved = useCommerce((s) => s.wishlist.includes(slug)) && mounted;
  const toggle = useCommerce((s) => s.toggleWishlist);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={withLabel ? undefined : `${saved ? t("removeFromWishlist") : t("addToWishlist")}: ${title}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(slug);
        toast.success(added ? t("addedToWishlist") : t("removedFromWishlist"), { description: title });
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        withLabel
          ? "h-11 border border-border bg-card px-4 text-sm font-medium hover:bg-secondary"
          : "size-9 bg-card/90 shadow-sm backdrop-blur hover:bg-card",
        className,
      )}
    >
      <motion.span
        key={saved ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
        className="inline-flex"
      >
        <HeartIcon
          aria-hidden="true"
          className={cn("size-4.5", saved ? "fill-coral text-coral-strong" : "text-foreground")}
        />
      </motion.span>
      {withLabel ? <span>{saved ? t("removeFromWishlist") : t("addToWishlist")}</span> : null}
    </button>
  );
}
