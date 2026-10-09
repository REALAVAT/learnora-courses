"use client";

import { DownloadIcon, SearchIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useDeferredValue, useId, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { instructorStudents } from "@/lib/data/teach";
import { formatDate, initials } from "@/lib/format";

const selectClass =
  "h-10 rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function TeachStudentsView() {
  const t = useTranslations("TeachStudents");
  const locale = useLocale() as Locale;
  const id = useId();
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");
  const deferred = useDeferredValue(query);

  const courseSlugs = [...new Set(instructorStudents.map((s) => s.courseSlug))];
  const q = deferred.trim().toLowerCase();
  const rows = instructorStudents
    .filter((s) => course === "all" || s.courseSlug === course)
    .filter((s) => !q || s.name.toLowerCase().includes(q) || s.email.includes(q))
    .sort((a, b) => b.lastActive.localeCompare(a.lastActive));

  function exportCsv() {
    const header = ["name", "email", "location", "course", "progress", "enrolled", "last_active"];
    const lines = rows.map((s) =>
      [
        s.name,
        s.email,
        s.location,
        getCourse(s.courseSlug)?.title.en ?? s.courseSlug,
        `${s.progress}%`,
        s.enrolledAt.slice(0, 10),
        s.lastActive.slice(0, 10),
      ]
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(","),
    );
    const url = URL.createObjectURL(
      new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "learnora-students.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("exported"));
  }

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
            <DownloadIcon aria-hidden="true" />
            {t("export")}
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor={`${id}-q`} className="sr-only">
            {t("search")}
          </label>
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10 rounded-xl bg-card pl-9"
          />
        </div>
        <label htmlFor={`${id}-course`} className="sr-only">
          {t("course")}
        </label>
        <select
          id={`${id}-course`}
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          className={selectClass}
        >
          <option value="all">{t("allCourses")}</option>
          {courseSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {getCourse(slug)?.title[locale]}
            </option>
          ))}
        </select>
        <p className="text-sm text-muted-foreground sm:ml-2" aria-live="polite">
          {t("count", { count: rows.length })}
        </p>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={UsersIcon} title={t("emptyTitle")} body={t("emptyBody")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">
                  {t("student")}
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  {t("course")}
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  {t("progress")}
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  {t("location")}
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  {t("enrolled")}
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  {t("lastActive")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((s) => {
                const courseTitle = getCourse(s.courseSlug)?.title[locale] ?? "";
                return (
                  <tr key={s.id} className="transition-colors hover:bg-muted/40">
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      <div className="flex items-center gap-3">
                        {s.avatar ? (
                          <Image
                            src={s.avatar}
                            alt=""
                            width={36}
                            height={36}
                            className="size-9 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="grid size-9 place-items-center rounded-full bg-indigo-soft text-xs font-semibold text-primary"
                          >
                            {initials(s.name)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium">{s.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </div>
                    </th>
                    <td className="max-w-48 truncate px-3 py-3">{courseTitle}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={s.progress}
                          aria-label={`${t("progress")}: ${s.name}`}
                          className="w-20"
                        />
                        <span className="text-xs tabular-nums">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{s.location}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(s.enrolledAt, locale, "short")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(s.lastActive, locale, "short")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
