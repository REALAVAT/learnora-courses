import { setRequestLocale } from "next-intl/server";
import { CheckoutView } from "@/components/learn/checkout-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/learn/checkout">) {
  return appMetadata(params, "Checkout");
}

export default async function CheckoutPage({ params, searchParams }: PageProps<"/[locale]/learn/checkout">) {
  setRequestLocale((await params).locale as Locale);
  const { plan, cycle } = await searchParams;
  return (
    <CheckoutView
      planId={typeof plan === "string" ? plan : undefined}
      cycle={typeof cycle === "string" ? cycle : undefined}
    />
  );
}
