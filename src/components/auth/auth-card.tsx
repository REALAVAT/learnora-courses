"use client";

import { InfoIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { AuthSwitch, DemoLoginButtons, LoginForm, SignupForm } from "./auth-form";

export function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const t = useTranslations("Auth");
  return (
    <div className="flex flex-col gap-7">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          {mode === "login" ? t("loginTitle") : t("signupTitle")}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {mode === "login" ? t("loginSubtitle") : t("signupSubtitle")}
        </p>
      </header>
      <DemoLoginButtons />
      <div className="flex items-center gap-3 text-xs text-muted-foreground uppercase">
        <span className="h-px flex-1 bg-border" />
        {t("orEmail")}
        <span className="h-px flex-1 bg-border" />
      </div>
      {mode === "login" ? <LoginForm /> : <SignupForm />}
      <Suspense fallback={<div className="h-5" />}>
        <AuthSwitch mode={mode} />
      </Suspense>
      <p className="flex items-start gap-2 rounded-xl bg-indigo-soft p-3 text-xs text-muted-foreground">
        <InfoIcon aria-hidden="true" className="mt-px size-4 shrink-0 text-primary" />
        {t("demoNote")}
      </p>
    </div>
  );
}
