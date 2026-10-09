import { setRequestLocale } from "next-intl/server";
import { WishlistView } from "@/components/learn/wishlist-view";
import type { Locale } from "@/i18n/routing";
import { appMetadata } from "@/lib/app-metadata";

export function generateMetadata({ params }: PageProps<"/[locale]/learn/wishlist">) {
  return appMetadata(params, "Wishlist");
}

export default async function WishlistPage({ params }: PageProps<"/[locale]/learn/wishlist">) {
  setRequestLocale((await params).locale as Locale);
  return <WishlistView />;
}
