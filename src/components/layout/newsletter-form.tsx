"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({ email: z.string().trim().email() });

export function NewsletterForm() {
  const t = useTranslations("Footer");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async () => {
        await new Promise((r) => setTimeout(r, 500));
        toast.success(t("subscribed"));
        reset();
      })}
      className="flex w-full max-w-md flex-col gap-2"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        {t("emailLabel")}
      </label>
      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "newsletter-error" : undefined}
          className="h-11 rounded-xl bg-card"
          {...register("email")}
        />
        <Button type="submit" size="xl" disabled={isSubmitting}>
          {t("subscribe")}
        </Button>
      </div>
      {errors.email ? (
        <p id="newsletter-error" className="text-sm text-destructive">
          {t("invalidEmail")}
        </p>
      ) : null}
    </form>
  );
}
