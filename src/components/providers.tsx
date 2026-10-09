"use client";

import { MotionConfig } from "framer-motion";
import { useTranslations } from "next-intl";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Common");
  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        containerAriaLabel={t("notifications")}
        toastOptions={{ closeButtonAriaLabel: t("dismissNotification") }}
      />
    </MotionConfig>
  );
}
