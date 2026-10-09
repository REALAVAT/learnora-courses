"use client";

import {
  ArrowRightIcon,
  DollarSignIcon,
  MegaphoneIcon,
  PlusIcon,
  StarIcon,
  TrendingUpIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { instructorStudents, revenueByMonth } from "@/lib/data/teach";
import { formatDate, formatNumber, formatPrice, initials } from "@/lib/format";
import { useAuth } from "@/lib/store/auth";
import { useTeach } from "@/lib/store/teach";
import { cn } from "@/lib/utils";
import { ChartFigure, monthLabel, RevenueAreaChart } from "./charts";

export function TeachDashboardView() {
  const t = useTranslations("Teach");
  const locale = useLocale() as Locale;
  const user = useAuth((s) => s.user);
  const courses = useTeach((s) => s.courses);
  const announcements = useTeach((s) => s.announcements);

  const published = courses.filter((c) => c.status === "published");
  const totalStudents = published.reduce((sum, c) => sum + c.students, 0);
  const avgRating = published.length ? published.reduce((sum, c) => sum + c.rating, 0) / published.length : 0;
  const last = revenueByMonth[revenueByMonth.length - 1];
  const prev = revenueByMonth[revenueByMonth.length - 2];
  const change = Math.round(((last.revenue - prev.revenue) / prev.revenue) * 1000) / 10;
  const money = (v: number) => formatPrice(v, locale);
  const chartData = revenueByMonth.map((m) => ({ label: monthLabel(m.month, locale), value: m.revenue }));
  const recent = [...instructorStudents].sort((a, b) => b.enrolledAt.localeCompare(a.enrolledAt)).slice(0, 5);
  const latest = announcements[0];
  const latestCourse = latest ? courses.find((c) => c.id === latest.courseId) : undefined;

  const kpis = [
    {
      label: t("kpi.students"),
      value: formatNumber(totalStudents, locale),
      icon: UsersIcon,
      tone: "bg-indigo-soft text-primary",
    },
    {
      label: t("kpi.revenue"),
      value: money(last.revenue),
      icon: DollarSignIcon,
      tone: "bg-success/15 text-success",
      delta: t("vsLastMonth", { change: `${change > 0 ? "+" : ""}${change}%` }),
    },
    {
      label: t("kpi.rating"),
      value: avgRating.toFixed(2),
      icon: StarIcon,
      tone: "bg-star/20 text-foreground",
    },
    { label: t("kpi.completion"), value: "42%", icon: TrophyIcon, tone: "bg-coral-soft text-coral-strong" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("greeting", { name: user?.name.split(" ")[0] ?? "" })}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("greetingSubtitle")}</p>
        </div>
        <Link href="/teach/courses?new=1" className={buttonVariants({ size: "lg" })}>
          <PlusIcon aria-hidden="true" />
          {t("newCourse")}
        </Link>
      </header>

      <dl className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, tone, delta }) => (
          <div key={label} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <span className={cn("grid size-10 place-items-center rounded-xl", tone)}>
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <div className="flex flex-col-reverse">
              <dt className="text-xs text-muted-foreground sm:text-sm">{label}</dt>
              <dd className="text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
            </div>
            {delta ? (
              <p className="inline-flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUpIcon aria-hidden="true" className="size-3.5" />
                {delta}
              </p>
            ) : null}
          </div>
        ))}
      </dl>

      <section aria-labelledby="revenue-title" className="rounded-3xl border bg-card p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="revenue-title" className="text-lg font-semibold">
              {t("revenueTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("revenueSubtitle")}</p>
          </div>
          <p className="text-2xl font-semibold tabular-nums">
            {money(revenueByMonth.reduce((s, m) => s + m.revenue, 0))}
          </p>
        </div>
        <ChartFigure
          className="h-64 sm:h-72"
          summary={t("chartSummary", {
            first: money(revenueByMonth[0].revenue),
            firstMonth: chartData[0].label,
            last: money(last.revenue),
            lastMonth: chartData[chartData.length - 1].label,
          })}
        >
          <RevenueAreaChart
            data={chartData}
            name={t("revenue")}
            format={money}
            formatAxis={(v) => `$${Math.round(v / 1000)}k`}
          />
        </ChartFigure>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <section aria-labelledby="performance-title" className="min-w-0 rounded-3xl border bg-card">
          <div className="flex items-center justify-between gap-3 p-5 sm:p-6">
            <h2 id="performance-title" className="text-lg font-semibold">
              {t("performanceTitle")}
            </h2>
            <Link
              href="/teach/courses"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("viewAll")}
              <ArrowRightIcon aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-y bg-muted/50 text-left text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-2.5 font-medium sm:px-6">
                    {t("course")}
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">
                    {t("students")}
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">
                    {t("rating")}
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">
                    {t("revenue")}
                  </th>
                  <th scope="col" className="px-5 py-2.5 font-medium sm:px-6">
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courses.map((c) => (
                  <tr key={c.id}>
                    <th scope="row" className="px-5 py-3 text-left font-medium sm:px-6">
                      <Link href={`/teach/courses/${c.id}`} className="hover:text-primary hover:underline">
                        {c.title}
                      </Link>
                    </th>
                    <td className="px-3 py-3 text-right tabular-nums">{formatNumber(c.students, locale)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {c.rating ? c.rating.toFixed(1) : "—"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{money(c.revenue)}</td>
                    <td className="px-5 py-3 sm:px-6">
                      <Badge variant={c.status === "published" ? "secondary" : "outline"}>
                        {c.status === "published" ? t("published") : t("draft")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section aria-labelledby="recent-title" className="rounded-3xl border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 id="recent-title" className="font-semibold">
                {t("recentTitle")}
              </h2>
              <Link href="/teach/students" className="text-sm font-medium text-primary hover:underline">
                {t("viewAll")}
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {recent.map((s) => (
                <li key={s.id} className="flex items-center gap-3">
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
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {getCourse(s.courseSlug)?.title[locale]}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(s.enrolledAt, locale, "short")}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="announce-title" className="rounded-3xl border bg-card p-5">
            <h2 id="announce-title" className="flex items-center gap-2 font-semibold">
              <MegaphoneIcon aria-hidden="true" className="size-5 text-coral-strong" />
              {t("announcementsTitle")}
            </h2>
            {latest ? (
              <div className="mt-3 rounded-xl bg-muted/60 p-3">
                <p className="text-sm font-medium">{latest.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{latest.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {latestCourse?.title} · {formatDate(latest.createdAt, locale, "short")}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{t("noAnnouncements")}</p>
            )}
            <Link
              href="/teach/announcements"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4 w-full")}
            >
              {t("postAnnouncement")}
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
