import { StarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block size-3.5">
            <StarIcon className="absolute inset-0 size-3.5 text-border" fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon className="size-3.5 text-star" fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function Rating({
  rating,
  count,
  className,
}: {
  rating: number;
  count?: number;
  className?: string;
}) {
  const t = useTranslations("Common");
  const locale = useLocale();
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <span className="sr-only">{t("rating", { rating: rating.toFixed(1) })}</span>
      <span aria-hidden="true" className="font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
      <Stars rating={rating} />
      {count !== undefined ? (
        <span className="text-muted-foreground">({formatNumber(count, locale)})</span>
      ) : null}
    </span>
  );
}
