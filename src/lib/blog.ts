import type { ComponentType } from "react";
import type { Locale } from "@/i18n/routing";

export async function loadPostContent(locale: Locale, slug: string) {
  const mod: { default: ComponentType } = await import(`../content/blog/${locale}/${slug}.mdx`);
  return mod.default;
}
