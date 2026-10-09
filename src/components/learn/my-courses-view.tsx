"use client";

import { BookOpenIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { cn } from "@/lib/utils";
import { EnrolledCourseCard } from "./enrolled-course-card";
import { useEnrolledCourses } from "./use-enrolled";

const filters = ["all", "inProgress", "completed"] as const;
type Filter = (typeof filters)[number];

export function MyCoursesView() {
  const t = useTranslations("Learn");
  const enrolled = useEnrolledCourses();
  const [filter, setFilter] = useState<Filter>("all");

  const visible = enrolled.filter((e) => {
    if (filter === "completed") return e.done >= e.total;
    if (filter === "inProgress") return e.done < e.total;
    return true;
  });

  return (
    <div>
      <PageHeader title={t("nav.courses")} subtitle={t("coursesSubtitle")} />
      {enrolled.length === 0 ? (
        <EmptyState
          icon={BookOpenIcon}
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={{ label: t("emptyCta"), href: "/courses" }}
        />
      ) : (
        <>
          <div
            role="group"
            aria-label={t("nav.courses")}
            className="mb-6 inline-flex gap-1 rounded-xl border bg-card p-1"
          >
            {filters.map((f) => {
              const count = enrolled.filter((e) =>
                f === "all" ? true : f === "completed" ? e.done >= e.total : e.done < e.total,
              ).length;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "h-9 rounded-lg px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(f)} <span className="ml-1 tabular-nums opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
          {visible.length === 0 ? (
            <EmptyState icon={BookOpenIcon} title={t("emptyFilterTitle")} body={t("emptyFilterBody")} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
              {visible.map((item) => (
                <EnrolledCourseCard key={item.course.slug} item={item} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
