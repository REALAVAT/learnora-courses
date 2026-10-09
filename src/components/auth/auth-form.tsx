"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCapIcon, PresentationIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Role } from "@/lib/store/auth";
import { startDemoSession } from "@/lib/store/demo";
import { cn } from "@/lib/utils";

function safeNext(value: string | null, role: Role) {
  const fallback = role === "instructor" ? "/teach" : "/learn";
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (role === "instructor" && value.startsWith("/learn")) return fallback;
  if (role === "student" && value.startsWith("/teach")) return fallback;
  return value;
}

function useFinishLogin() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const locale = useLocale() as Locale;
  return (role: Role, overrides?: { name?: string; email?: string }) => {
    const user = startDemoSession(role, locale, overrides);
    toast.success(t("welcome", { name: user.name.split(" ")[0] }));
    const next = new URLSearchParams(window.location.search).get("next");
    router.push(safeNext(next, role));
  };
}

export function DemoLoginButtons() {
  const t = useTranslations("Auth");
  const finish = useFinishLogin();
  const options = [
    {
      role: "student" as const,
      icon: GraduationCapIcon,
      label: t("studentDemo"),
      hint: t("studentDemoHint"),
    },
    {
      role: "instructor" as const,
      icon: PresentationIcon,
      label: t("instructorDemo"),
      hint: t("instructorDemoHint"),
    },
  ];
  return (
    <div>
      <p className="mb-3 text-sm font-medium">{t("demoTitle")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(({ role, icon: Icon, label, hint }) => (
          <button
            key={role}
            type="button"
            onClick={() => finish(role)}
            className="group flex items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-[border-color,box-shadow,translate] duration-200 ease-out outline-none hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:hover:translate-y-0"
          >
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-xl",
                role === "student" ? "bg-indigo-soft text-primary" : "bg-coral-soft text-coral-strong",
              )}
            >
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold">{label}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{hint}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function LoginForm() {
  const t = useTranslations("Auth");
  const finish = useFinishLogin();
  const id = useId();
  const schema = z.object({
    email: z.string().trim().email(t("errors.email")),
    password: z.string().min(6, t("errors.password")),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "alex.morgan@learnora.demo", password: "demo1234" },
  });

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(async (values) => {
        await new Promise((r) => setTimeout(r, 400));
        finish("student", { email: values.email });
      })}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-email`}>{t("email")}</Label>
        <Input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          className="h-11 rounded-xl"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          {...register("email")}
        />
        <FieldError id={`${id}-email-error`} message={errors.email?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${id}-password`}>{t("password")}</Label>
          <button
            type="button"
            onClick={() => toast.info(t("forgotToast"))}
            className="text-sm text-primary hover:underline"
          >
            {t("forgot")}
          </button>
        </div>
        <Input
          id={`${id}-password`}
          type="password"
          autoComplete="current-password"
          className="h-11 rounded-xl"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? `${id}-password-error` : undefined}
          {...register("password")}
        />
        <FieldError id={`${id}-password-error`} message={errors.password?.message} />
      </div>
      <Button type="submit" size="xl" className="mt-2 w-full" disabled={isSubmitting}>
        {t("login")}
      </Button>
    </form>
  );
}

export function SignupForm() {
  const t = useTranslations("Auth");
  const finish = useFinishLogin();
  const id = useId();
  const [role, setRole] = useState<Role>("student");
  const schema = z.object({
    name: z.string().trim().min(2, t("errors.name")),
    email: z.string().trim().email(t("errors.email")),
    password: z.string().min(6, t("errors.password")),
    terms: z.literal(true, { errorMap: () => ({ message: t("errors.terms") }) }),
  });
  type Values = z.infer<typeof schema>;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", terms: false as unknown as true },
  });

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(async (values) => {
        await new Promise((r) => setTimeout(r, 400));
        finish(role, { name: values.name, email: values.email });
      })}
    >
      <fieldset>
        <legend className="mb-2 text-sm font-medium">{t("role")}</legend>
        <div className="grid grid-cols-2 gap-2 rounded-xl border bg-muted/50 p-1">
          {(["student", "instructor"] as const).map((r) => (
            <label
              key={r}
              className={cn(
                "flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                role === r
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
                className="sr-only"
              />
              {r === "student" ? (
                <GraduationCapIcon aria-hidden="true" className="size-4" />
              ) : (
                <PresentationIcon aria-hidden="true" className="size-4" />
              )}
              {r === "student" ? t("roleStudent") : t("roleInstructor")}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-name`}>{t("name")}</Label>
        <Input
          id={`${id}-name`}
          autoComplete="name"
          className="h-11 rounded-xl"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          {...register("name")}
        />
        <FieldError id={`${id}-name-error`} message={errors.name?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-email`}>{t("email")}</Label>
        <Input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          className="h-11 rounded-xl"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          {...register("email")}
        />
        <FieldError id={`${id}-email-error`} message={errors.email?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-password`}>{t("password")}</Label>
        <Input
          id={`${id}-password`}
          type="password"
          autoComplete="new-password"
          className="h-11 rounded-xl"
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? `${id}-password-error` : undefined}
          {...register("password")}
        />
        <FieldError id={`${id}-password-error`} message={errors.password?.message} />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2.5">
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <Checkbox
                id={`${id}-terms`}
                aria-labelledby={`${id}-terms-label`}
                checked={field.value === true}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? `${id}-terms-error` : undefined}
                className="mt-0.5"
              />
            )}
          />
          <Label
            id={`${id}-terms-label`}
            htmlFor={`${id}-terms`}
            className="text-sm leading-snug font-normal text-muted-foreground"
          >
            {t("terms")}
          </Label>
        </div>
        <FieldError id={`${id}-terms-error`} message={errors.terms?.message} />
      </div>
      <Button type="submit" size="xl" className="mt-2 w-full" disabled={isSubmitting}>
        {t("signup")}
      </Button>
    </form>
  );
}

export function AuthSwitch({ mode }: { mode: "login" | "signup" }) {
  const t = useTranslations("Auth");
  const params = useSearchParams();
  const next = params.get("next");
  const query = next ? { next } : undefined;
  return (
    <p className="text-center text-sm text-muted-foreground">
      {mode === "login" ? t("noAccount") : t("haveAccount")}{" "}
      <Link
        href={{ pathname: mode === "login" ? "/signup" : "/login", query }}
        className="font-medium text-primary hover:underline"
      >
        {mode === "login" ? t("createOne") : t("loginLink")}
      </Link>
    </p>
  );
}
