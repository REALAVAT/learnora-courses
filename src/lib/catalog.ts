import type { CourseSummary } from "@/lib/types";

export const levelOptions = ["beginner", "intermediate", "advanced", "all"] as const;
export const priceOptions = ["free", "paid", "under75", "over75"] as const;
export const durationOptions = ["under1", "1to2", "over2"] as const;
export const languageOptions = ["en", "es"] as const;
export const ratingOptions = ["any", "4.8", "4.5", "4.0"] as const;
export const sortOptions = ["popular", "rating", "newest", "price-asc", "price-desc"] as const;

export type SortOption = (typeof sortOptions)[number];

export function ratingKey(value: string) {
  return value === "any" ? "any" : (`r${value.replace(".", "")}` as "r48" | "r45" | "r40");
}

export type CatalogFilters = {
  q: string;
  category: string[];
  level: string[];
  price: string[];
  duration: string[];
  language: string[];
  rating: string;
  sort: SortOption;
  view: "grid" | "list";
};

const list = (value: string | null) => (value ? value.split(",").filter(Boolean) : []);

export function parseFilters(params: URLSearchParams): CatalogFilters {
  const sort = params.get("sort");
  return {
    q: params.get("q") ?? "",
    category: list(params.get("category")),
    level: list(params.get("level")),
    price: list(params.get("price")),
    duration: list(params.get("duration")),
    language: list(params.get("language")),
    rating: params.get("rating") ?? "any",
    sort: (sortOptions as readonly string[]).includes(sort ?? "") ? (sort as SortOption) : "popular",
    view: params.get("view") === "list" ? "list" : "grid",
  };
}

export function serializeFilters(filters: CatalogFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  for (const key of ["category", "level", "price", "duration", "language"] as const) {
    if (filters[key].length) params.set(key, filters[key].join(","));
  }
  if (filters.rating !== "any") params.set("rating", filters.rating);
  if (filters.sort !== "popular") params.set("sort", filters.sort);
  if (filters.view !== "grid") params.set("view", filters.view);
  return params.toString();
}

export function activeFilterCount(f: CatalogFilters) {
  return (
    f.category.length +
    f.level.length +
    f.price.length +
    f.duration.length +
    f.language.length +
    (f.rating !== "any" ? 1 : 0)
  );
}

function matchesPrice(price: number, options: string[]) {
  if (!options.length) return true;
  return options.some((o) => {
    if (o === "free") return price === 0;
    if (o === "paid") return price > 0;
    if (o === "under75") return price > 0 && price < 75;
    if (o === "over75") return price >= 75;
    return false;
  });
}

function matchesDuration(minutes: number, options: string[]) {
  if (!options.length) return true;
  return options.some((o) => {
    if (o === "under1") return minutes < 60;
    if (o === "1to2") return minutes >= 60 && minutes <= 120;
    if (o === "over2") return minutes > 120;
    return false;
  });
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filterCourses(courses: CourseSummary[], f: CatalogFilters) {
  const query = normalize(f.q.trim());
  const minRating = f.rating === "any" ? 0 : Number(f.rating);

  const result = courses.filter((c) => {
    if (query) {
      const haystack = normalize(
        [c.title.en, c.title.es, c.subtitle.en, c.subtitle.es, c.instructor.name, c.category].join(" "),
      );
      if (!query.split(/\s+/).every((word) => haystack.includes(word))) return false;
    }
    if (f.category.length && !f.category.includes(c.category)) return false;
    if (f.level.length && !f.level.includes(c.level)) return false;
    if (f.language.length && !f.language.includes(c.language)) return false;
    if (!matchesPrice(c.price, f.price)) return false;
    if (!matchesDuration(c.durationMinutes, f.duration)) return false;
    if (c.rating < minRating) return false;
    return true;
  });

  const sorters: Record<SortOption, (a: CourseSummary, b: CourseSummary) => number> = {
    popular: (a, b) => b.students - a.students,
    rating: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
    newest: (a, b) => b.updated.localeCompare(a.updated),
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
  };
  return result.sort(sorters[f.sort]);
}
