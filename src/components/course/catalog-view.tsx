"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGridIcon,
  ListIcon,
  SearchIcon,
  SearchXIcon,
  SlidersHorizontalIcon,
  XIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  activeFilterCount,
  durationOptions,
  filterCourses,
  languageOptions,
  levelOptions,
  parseFilters,
  priceOptions,
  ratingKey,
  ratingOptions,
  serializeFilters,
  sortOptions,
  type CatalogFilters,
  type SortOption,
} from "@/lib/catalog";
import { categoryIds } from "@/lib/data/categories";
import type { CourseSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CourseCard } from "./course-card";

type ListKey = "category" | "level" | "price" | "duration" | "language";

function useCatalogState() {
  const searchParams = useSearchParams();
  const filters = useMemo(() => parseFilters(new URLSearchParams(searchParams.toString())), [searchParams]);

  function update(next: Partial<CatalogFilters>) {
    const qs = serializeFilters({ ...filters, ...next });
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(null, "", url);
  }

  return { filters, update };
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function CheckOption({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  count?: number;
}) {
  const id = useId();
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} aria-labelledby={id} />
      <span id={id} className="flex-1">
        {label}
      </span>
      {count !== undefined ? <span className="text-xs text-muted-foreground">{count}</span> : null}
    </label>
  );
}

function FilterPanel({
  filters,
  update,
  all,
}: {
  filters: CatalogFilters;
  update: (next: Partial<CatalogFilters>) => void;
  all: CourseSummary[];
}) {
  const t = useTranslations("Catalog");
  const tc = useTranslations("Common");

  const toggle = (key: ListKey, value: string, on: boolean) => {
    const current = new Set(filters[key]);
    if (on) current.add(value);
    else current.delete(value);
    update({ [key]: [...current] });
  };

  return (
    <div className="flex flex-col gap-6">
      <FilterGroup title={t("category")}>
        {categoryIds.map((id) => (
          <CheckOption
            key={id}
            label={tc(`category.${id}`)}
            count={all.filter((c) => c.category === id).length}
            checked={filters.category.includes(id)}
            onChange={(on) => toggle("category", id, on)}
          />
        ))}
      </FilterGroup>
      <Separator />
      <FilterGroup title={t("level")}>
        {levelOptions.map((id) => (
          <CheckOption
            key={id}
            label={tc(`level.${id}`)}
            checked={filters.level.includes(id)}
            onChange={(on) => toggle("level", id, on)}
          />
        ))}
      </FilterGroup>
      <Separator />
      <FilterGroup title={t("price")}>
        {priceOptions.map((id) => (
          <CheckOption
            key={id}
            label={t(`priceOptions.${id}`)}
            checked={filters.price.includes(id)}
            onChange={(on) => toggle("price", id, on)}
          />
        ))}
      </FilterGroup>
      <Separator />
      <FilterGroup title={t("duration")}>
        {durationOptions.map((id) => (
          <CheckOption
            key={id}
            label={t(`durationOptions.${id}`)}
            checked={filters.duration.includes(id)}
            onChange={(on) => toggle("duration", id, on)}
          />
        ))}
      </FilterGroup>
      <Separator />
      <FilterGroup title={t("language")}>
        {languageOptions.map((id) => (
          <CheckOption
            key={id}
            label={tc(`language.${id}`)}
            checked={filters.language.includes(id)}
            onChange={(on) => toggle("language", id, on)}
          />
        ))}
      </FilterGroup>
      <Separator />
      <FilterGroup title={t("rating")}>
        <RadioGroup value={filters.rating} onValueChange={(v) => update({ rating: String(v) })}>
          {ratingOptions.map((id) => (
            <label key={id} className="flex cursor-pointer items-center gap-3 text-sm">
              <RadioGroupItem value={id} aria-label={t(`ratingOptions.${ratingKey(id)}`)} />
              <span aria-hidden="true">{t(`ratingOptions.${ratingKey(id)}`)}</span>
            </label>
          ))}
        </RadioGroup>
      </FilterGroup>
    </div>
  );
}

export function CatalogView({ courses }: { courses: CourseSummary[] }) {
  const t = useTranslations("Catalog");
  const tc = useTranslations("Common");
  const { filters, update } = useCatalogState();
  const [query, setQuery] = useState(filters.q);
  const [prevQ, setPrevQ] = useState(filters.q);
  const [sheetOpen, setSheetOpen] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  if (filters.q !== prevQ) {
    setPrevQ(filters.q);
    setQuery(filters.q);
  }

  useEffect(() => () => clearTimeout(debounce.current), []);

  const results = useMemo(() => filterCourses(courses, filters), [courses, filters]);
  const activeCount = activeFilterCount(filters);

  const chips: { key: string; label: string; remove: () => void }[] = [];
  const listKeys: { key: ListKey; label: (v: string) => string }[] = [
    { key: "category", label: (v) => tc(`category.${v}` as "category.design") },
    { key: "level", label: (v) => tc(`level.${v}` as "level.beginner") },
    { key: "price", label: (v) => t(`priceOptions.${v}` as "priceOptions.free") },
    { key: "duration", label: (v) => t(`durationOptions.${v}` as "durationOptions.under1") },
    { key: "language", label: (v) => tc(`language.${v}` as "language.en") },
  ];
  for (const { key, label } of listKeys) {
    for (const value of filters[key]) {
      chips.push({
        key: `${key}-${value}`,
        label: label(value),
        remove: () => update({ [key]: filters[key].filter((v) => v !== value) }),
      });
    }
  }
  if (filters.rating !== "any") {
    chips.push({
      key: "rating",
      label: t(`ratingOptions.${ratingKey(filters.rating)}`),
      remove: () => update({ rating: "any" }),
    });
  }

  const clearAll = () =>
    update({ category: [], level: [], price: [], duration: [], language: [], rating: "any", q: "" });

  const sortItems = sortOptions.map((value) => ({ value, label: t(`sortOptions.${value}`) }));

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-10">
      <aside aria-label={t("filters")} className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold">{t("filters")}</h2>
            {activeCount ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t("clearAll")}
              </button>
            ) : null}
          </div>
          <FilterPanel filters={filters} update={update} all={courses} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="catalog-search"
              type="search"
              value={query}
              placeholder={t("searchPlaceholder")}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                clearTimeout(debounce.current);
                debounce.current = setTimeout(() => {
                  setPrevQ(value);
                  update({ q: value });
                }, 250);
              }}
              className="h-11 w-full rounded-xl border border-input bg-card pr-3 pl-10 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger render={<Button variant="outline" size="xl" className="lg:hidden" />}>
                <SlidersHorizontalIcon aria-hidden="true" />
                {activeCount ? t("filtersCount", { count: activeCount }) : t("filters")}
              </SheetTrigger>
              <SheetContent side="left" className="w-[88vw] max-w-sm gap-0 p-0">
                <SheetHeader className="border-b px-5 py-4">
                  <SheetTitle>{t("filters")}</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto px-5 py-5">
                  <FilterPanel filters={filters} update={update} all={courses} />
                </div>
                <SheetFooter className="flex-row border-t p-4">
                  <Button variant="outline" size="xl" className="flex-1" onClick={clearAll}>
                    {t("clearAll")}
                  </Button>
                  <Button size="xl" className="flex-1" onClick={() => setSheetOpen(false)}>
                    {t("showResults", { count: results.length })}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <Select
              items={sortItems}
              value={filters.sort}
              onValueChange={(v) => update({ sort: (v ?? "popular") as SortOption })}
            >
              <SelectTrigger
                aria-label={t("sort")}
                className="h-11! min-w-44 flex-1 rounded-xl bg-card px-3 sm:flex-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortItems.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ToggleGroup
              aria-label={t("view")}
              value={[filters.view]}
              onValueChange={(v) => v[0] && update({ view: v[0] as "grid" | "list" })}
              variant="outline"
              className="hidden sm:flex"
            >
              <ToggleGroupItem value="grid" aria-label={t("grid")} className="size-11">
                <LayoutGridIcon aria-hidden="true" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label={t("list")} className="size-11">
                <ListIcon aria-hidden="true" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p aria-live="polite" className="mr-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{t("results", { count: results.length })}</span>{" "}
            {filters.q ? t("resultsFor", { query: filters.q }) : null}
          </p>
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.remove}
              aria-label={t("removeFilter", { label: chip.label })}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-primary/15"
            >
              {chip.label}
              <XIcon aria-hidden="true" className="size-3" />
            </button>
          ))}
          {chips.length > 1 ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-primary hover:underline"
            >
              {t("clearAll")}
            </button>
          ) : null}
        </div>

        {results.length ? (
          <ul
            className={cn(
              "grid gap-6",
              filters.view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((course, i) => (
                <motion.li
                  key={course.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="flex [&>article]:flex-1"
                >
                  <CourseCard course={course} layout={filters.view} priority={i < 3} headingLevel="h2" />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
              <SearchXIcon aria-hidden="true" className="size-6" />
            </span>
            <h2 className="mt-5 text-lg font-semibold">{t("emptyTitle")}</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("emptyBody")}</p>
            <Button size="xl" className="mt-6" onClick={clearAll}>
              {t("emptyAction")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
