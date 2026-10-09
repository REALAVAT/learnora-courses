import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  price,
  originalPrice,
  className,
  size = "md",
}: {
  price: number;
  originalPrice?: number;
  className?: string;
  size?: "md" | "lg";
}) {
  const t = useTranslations("Common");
  const locale = useLocale();
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold tracking-tight", size === "lg" ? "text-3xl" : "text-base")}>
        {price === 0 ? t("free") : formatPrice(price, locale)}
      </span>
      {originalPrice && originalPrice > price ? (
        <s className={cn("text-muted-foreground", size === "lg" ? "text-lg" : "text-sm")}>
          {formatPrice(originalPrice, locale)}
        </s>
      ) : null}
    </span>
  );
}
