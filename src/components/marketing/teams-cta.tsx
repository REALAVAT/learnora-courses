"use client";

import { BuildingIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function TeamsCta() {
  const t = useTranslations("Pricing");
  return (
    <div className="flex flex-col items-start gap-5 rounded-3xl border bg-indigo-soft p-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <BuildingIcon aria-hidden="true" className="size-6" />
        </span>
        <div>
          <h2 className="text-xl font-semibold">{t("teamsTitle")}</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("teamsBody")}</p>
        </div>
      </div>
      <Button size="xl" onClick={() => toast.success(t("teamsToast"))}>
        {t("teamsCta")}
      </Button>
    </div>
  );
}
