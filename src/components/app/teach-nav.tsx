"use client";

import {
  BarChart3Icon,
  LayoutDashboardIcon,
  LibraryIcon,
  MegaphoneIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AppNav } from "./app-nav";

export function TeachNav() {
  const t = useTranslations("Teach");
  return (
    <AppNav
      label={t("sidebarLabel")}
      items={[
        { href: "/teach", label: t("nav.dashboard"), icon: LayoutDashboardIcon, exact: true },
        { href: "/teach/courses", label: t("nav.courses"), icon: LibraryIcon },
        { href: "/teach/students", label: t("nav.students"), icon: UsersIcon },
        { href: "/teach/announcements", label: t("nav.announcements"), icon: MegaphoneIcon },
        { href: "/teach/analytics", label: t("nav.analytics"), icon: BarChart3Icon },
        { href: "/teach/settings", label: t("nav.settings"), icon: SettingsIcon },
      ]}
    />
  );
}
