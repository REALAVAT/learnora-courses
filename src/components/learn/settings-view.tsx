"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcwIcon, SparklesIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PageHeader } from "@/components/app/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/lib/store/auth";
import { resetDemoData } from "@/lib/store/demo";
import { useLearning } from "@/lib/store/learning";
import { usePrefs } from "@/lib/store/prefs";
import { cn } from "@/lib/utils";

function Panel({
  id,
  title,
  body,
  children,
}: {
  id: string;
  title: string;
  body?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="rounded-3xl border bg-card p-6">
      <h2 id={id} className="text-lg font-semibold">
        {title}
      </h2>
      {body ? <p className="mt-1 text-sm text-muted-foreground">{body}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ProfileForm() {
  const t = useTranslations("Settings");
  const tc = useTranslations("Common");
  const id = useId();
  const user = useAuth((s) => s.user);
  const updateProfile = useAuth((s) => s.updateProfile);
  const schema = z.object({
    name: z.string().trim().min(2, t("errors.name")),
    email: z.string().trim().email(t("errors.email")),
    headline: z.string().trim().max(80),
  });
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", headline: user?.headline ?? "" },
  });

  return (
    <form
      noValidate
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        await new Promise((r) => setTimeout(r, 300));
        updateProfile(values);
        reset(values);
        toast.success(t("saved"));
      })}
    >
      {(["name", "email"] as const).map((name) => (
        <div key={name} className="flex flex-col gap-2">
          <Label htmlFor={`${id}-${name}`}>{t(name)}</Label>
          <Input
            id={`${id}-${name}`}
            type={name === "email" ? "email" : "text"}
            autoComplete={name}
            className="h-11 rounded-xl"
            aria-invalid={errors[name] ? true : undefined}
            aria-describedby={errors[name] ? `${id}-${name}-error` : undefined}
            {...register(name)}
          />
          {errors[name] ? (
            <p id={`${id}-${name}-error`} className="text-sm text-destructive">
              {errors[name]?.message}
            </p>
          ) : null}
        </div>
      ))}
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor={`${id}-headline`}>{t("headline")}</Label>
        <Input id={`${id}-headline`} className="h-11 rounded-xl" maxLength={80} {...register("headline")} />
      </div>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" size="lg" disabled={!isDirty || isSubmitting}>
          {t("save")}
        </Button>
        {isDirty ? (
          <Button type="button" size="lg" variant="ghost" onClick={() => reset()}>
            {tc("cancel")}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function PreferenceRow({
  label,
  body,
  checked,
  onChange,
}: {
  label: string;
  body: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <p id={`${id}-label`} className="text-sm font-medium">
          {label}
        </p>
        <p id={`${id}-body`} className="mt-0.5 text-sm text-muted-foreground">
          {body}
        </p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-body`}
        className="mt-1"
      />
    </div>
  );
}

export function SettingsView({ instructor = false }: { instructor?: boolean }) {
  const t = useTranslations("Settings");
  const tp = useTranslations("Pricing");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const prefs = usePrefs();
  const subscription = useLearning((s) => s.subscription);
  const setSubscription = useLearning((s) => s.setSubscription);
  const logout = useAuth((s) => s.logout);

  const paid = subscription && subscription.plan !== "free" ? subscription : null;

  function resetAll() {
    resetDemoData();
    logout();
    setConfirmOpen(false);
    toast.success(t("resetDone"));
    router.push("/");
  }

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="flex max-w-3xl flex-col gap-6">
        <Panel id="settings-profile" title={t("profile")} body={t("profileBody")}>
          <ProfileForm />
        </Panel>

        <Panel id="settings-preferences" title={t("preferences")}>
          <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <p id="settings-language" className="text-sm font-medium">
              {t("language")}
            </p>
            <div
              role="group"
              aria-labelledby="settings-language"
              className="inline-flex rounded-xl border p-1"
            >
              {routing.locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  lang={l}
                  aria-pressed={l === locale}
                  disabled={pending}
                  onClick={() =>
                    l !== locale &&
                    startTransition(() => router.replace(pathname, { locale: l, scroll: false }))
                  }
                  className={cn(
                    "h-9 rounded-lg px-4 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    l === locale
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l === "en" ? "English" : "Español"}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y border-t">
            {instructor ? null : (
              <PreferenceRow
                label={t("autoplay")}
                body={t("autoplayBody")}
                checked={prefs.autoplay}
                onChange={(autoplay) => prefs.set({ autoplay })}
              />
            )}
            <PreferenceRow
              label={t("emailDigest")}
              body={t("emailDigestBody")}
              checked={prefs.emailDigest}
              onChange={(emailDigest) => prefs.set({ emailDigest })}
            />
          </div>
        </Panel>

        {instructor ? null : (
          <Panel id="settings-subscription" title={t("subscription")}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-indigo-soft text-primary">
                  <SparklesIcon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {paid ? t("currentPlan", { plan: tp(`plan.${paid.plan}`) }) : t("freePlan")}
                  </p>
                  {paid ? (
                    <p className="text-xs text-muted-foreground">
                      {tp(paid.cycle)} · {formatDate(paid.since, locale)}
                    </p>
                  ) : null}
                </div>
              </div>
              {paid ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubscription(null);
                    toast.success(t("planCanceled"));
                  }}
                >
                  {t("cancelPlan")}
                </Button>
              ) : (
                <Link href="/pricing" className={buttonVariants()}>
                  {t("upgrade")}
                </Link>
              )}
            </div>
          </Panel>
        )}

        <Panel id="settings-demo" title={t("demoData")} body={t("demoDataBody")}>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogTrigger render={<Button variant="destructive" />}>
              <RotateCcwIcon aria-hidden="true" />
              {t("reset")}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("reset")}</DialogTitle>
                <DialogDescription>{t("resetConfirm")}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>{tc("cancel")}</DialogClose>
                <Button variant="destructive" onClick={resetAll}>
                  {t("reset")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Panel>
      </div>
    </div>
  );
}
