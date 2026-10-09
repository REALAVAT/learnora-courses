"use client";

import {
  AwardIcon,
  BookOpenIcon,
  HeartIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  SettingsIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMounted } from "@/hooks/use-mounted";
import { useCommerce } from "@/lib/store/commerce";
import { AppNav } from "./app-nav";

export function LearnNav() {
  const t = useTranslations("Learn");
  const mounted = useMounted();
  const cart = useCommerce((s) => s.cart.length);
  const wishlist = useCommerce((s) => s.wishlist.length);

  return (
    <AppNav
      label={t("sidebarLabel")}
      items={[
        { href: "/learn", label: t("nav.dashboard"), icon: LayoutDashboardIcon, exact: true },
        { href: "/learn/courses", label: t("nav.courses"), icon: BookOpenIcon },
        { href: "/learn/certificates", label: t("nav.certificates"), icon: AwardIcon },
        { href: "/learn/wishlist", label: t("nav.wishlist"), icon: HeartIcon, count: mounted ? wishlist : 0 },
        { href: "/learn/cart", label: t("nav.cart"), icon: ShoppingCartIcon, count: mounted ? cart : 0 },
        { href: "/learn/orders", label: t("nav.orders"), icon: ReceiptIcon },
        { href: "/learn/settings", label: t("nav.settings"), icon: SettingsIcon },
      ]}
    />
  );
}
