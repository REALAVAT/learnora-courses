import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

type Namespace = "Learn" | "Quiz" | "Certificate" | "Wishlist" | "Cart" | "Checkout" | "Orders" | "Settings";

export async function appMetadata(
  params: Promise<{ locale: string }>,
  namespace: Namespace,
): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}
