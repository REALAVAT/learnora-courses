"use client";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";

const popular = [
  { label: "Figma", q: "Figma" },
  { label: "React", q: "React" },
  { label: "SQL", q: "SQL" },
  { label: "AI", q: "AI" },
];

export function HeroSearch() {
  const t = useTranslations("Home");
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q")?.toString().trim();
          router.push(q ? `/courses?q=${encodeURIComponent(q)}` : "/courses");
        }}
        className="flex w-full max-w-xl items-center gap-2 rounded-2xl border bg-card p-2 shadow-[0_10px_30px_-18px_color-mix(in_oklch,var(--primary)_55%,transparent)] focus-within:ring-3 focus-within:ring-ring/30"
      >
        <label htmlFor="hero-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <SearchIcon aria-hidden="true" className="ml-2 size-5 shrink-0 text-muted-foreground" />
        <input
          id="hero-search"
          name="q"
          type="search"
          placeholder={t("searchPlaceholder")}
          className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        <Button type="submit" size="xl">
          {t("searchButton")}
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span>{t("popular")}</span>
        {popular.map((p) => (
          <Link
            key={p.q}
            href={`/courses?q=${encodeURIComponent(p.q)}`}
            className="rounded-full border bg-card px-3 py-1 text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
          >
            {p.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
