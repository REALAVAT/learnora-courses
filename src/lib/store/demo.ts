"use client";

import type { Locale } from "@/i18n/routing";
import { useAuth, type Role } from "./auth";
import { useCommerce } from "./commerce";
import { useLearning } from "./learning";
import { useTeach } from "./teach";

export function startDemoSession(role: Role, locale: Locale, overrides?: { name?: string; email?: string }) {
  const user = useAuth.getState().login(role, overrides);
  if (role === "student") {
    useLearning.getState().seedDemo(user.name);
    useCommerce.getState().seedDemo();
  } else if (user.instructorSlug) {
    useTeach.getState().seedDemo(user.instructorSlug, locale);
  }
  return user;
}

export function resetDemoData() {
  useLearning.getState().reset();
  useCommerce.getState().reset();
  useTeach.getState().reset();
}
