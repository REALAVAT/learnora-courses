"use client";

import { TriangleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("Error");
  return (
    <main id="main" className="container-page grid flex-1 place-items-center py-24">
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-2xl bg-coral-soft text-coral-strong">
          <TriangleAlertIcon aria-hidden="true" className="size-7" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-muted-foreground">{t("body")}</p>
        <Button size="xl" className="mt-8" onClick={reset}>
          {t("retry")}
        </Button>
      </div>
    </main>
  );
}
