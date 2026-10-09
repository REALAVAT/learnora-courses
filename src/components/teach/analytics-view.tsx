"use client";

import { LightbulbIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/app/page-header";
import type { Locale } from "@/i18n/routing";
import { completionFunnel, revenueByMonth, trafficSources, watchTimeByWeekday } from "@/lib/data/teach";
import { formatNumber } from "@/lib/format";
import { ChartFigure, chartColors, DonutChart, monthLabel, SimpleBarChart } from "./charts";

function Panel({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="min-w-0 rounded-3xl border bg-card p-5 sm:p-6">
      <h2 id={id} className="mb-4 text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function TeachAnalyticsView() {
  const t = useTranslations("TeachAnalytics");
  const tt = useTranslations("Teach");
  const locale = useLocale() as Locale;
  const num = (v: number) => formatNumber(v, locale);
  const pct = (v: number) => `${v}%`;
  const listSummary = (items: { label: string; value: string }[]) =>
    items.map((i) => `${i.label}: ${i.value}`).join(", ");

  const enrollments = revenueByMonth.map((m) => ({
    label: monthLabel(m.month, locale),
    value: m.enrollments,
  }));
  const sources = trafficSources.map((s) => ({ label: t(`sources.${s.source}`), value: s.value }));
  const funnel = completionFunnel.map((f) => ({ label: t(`funnel.${f.stage}`), value: f.value }));
  const weekday = watchTimeByWeekday.map((d) => ({
    label: new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", {
      weekday: "short",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(2026, 9, 4 + d.day))),
    value: d.minutes,
  }));

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel id="an-enrollments" title={t("enrollmentsTitle")}>
          <ChartFigure
            className="h-64"
            summary={listSummary(enrollments.map((e) => ({ label: e.label, value: num(e.value) })))}
          >
            <SimpleBarChart data={enrollments} name={tt("enrollments")} format={num} />
          </ChartFigure>
        </Panel>

        <Panel id="an-sources" title={t("sourcesTitle")}>
          <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <ChartFigure
              className="mx-auto aspect-square max-h-56 w-full max-w-56"
              summary={listSummary(sources.map((s) => ({ label: s.label, value: pct(s.value) })))}
            >
              <DonutChart data={sources} format={pct} />
            </ChartFigure>
            <ul className="flex flex-col gap-2.5 text-sm">
              {sources.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="size-3 shrink-0 rounded-full"
                    style={{ background: chartColors[i % chartColors.length] }}
                  />
                  <span className="flex-1">{s.label}</span>
                  <span className="font-semibold tabular-nums">{pct(s.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel id="an-funnel" title={t("funnelTitle")}>
          <ChartFigure
            className="h-64"
            summary={listSummary(funnel.map((f) => ({ label: f.label, value: pct(f.value) })))}
          >
            <SimpleBarChart
              data={funnel}
              name={t("funnelTitle")}
              format={pct}
              layout="vertical"
              colors={chartColors}
            />
          </ChartFigure>
        </Panel>

        <Panel id="an-watch" title={t("watchTitle")}>
          <ChartFigure
            className="h-64"
            summary={listSummary(weekday.map((d) => ({ label: d.label, value: num(d.value) })))}
          >
            <SimpleBarChart data={weekday} name={t("minutes")} format={num} color="var(--chart-2)" />
          </ChartFigure>
        </Panel>
      </div>

      <section aria-labelledby="an-insights" className="mt-6 rounded-3xl border bg-indigo-soft/60 p-5 sm:p-6">
        <h2 id="an-insights" className="flex items-center gap-2 text-lg font-semibold">
          <LightbulbIcon aria-hidden="true" className="size-5 text-primary" />
          {t("insightsTitle")}
        </h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {(["one", "two", "three"] as const).map((k) => (
            <li key={k} className="rounded-2xl bg-card p-4 text-sm">
              {t(`insights.${k}`)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
