import { setRequestLocale } from "next-intl/server";
import { CartView } from "@/components/learn/cart-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/learn/cart">) {
  return appMetadata(params, "Cart");
}

export default async function CartPage({ params }: PageProps<"/[locale]/learn/cart">) {
  setRequestLocale((await params).locale as Locale);
  return <CartView />;
}
