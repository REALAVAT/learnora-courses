"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

const axisTick = { fill: "var(--muted-foreground)", fontSize: 12 };

export const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function monthLabel(month: string, locale: string) {
  const [y, m] = month.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
}

function TooltipBox({
  active,
  label,
  payload,
  format,
}: {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string; value?: number; color?: string }[];
  format: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-xs shadow-lg">
      {label !== undefined ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-muted-foreground">
          <span aria-hidden="true" className="size-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <span className="font-semibold text-foreground tabular-nums">{format(p.value ?? 0)}</span>
        </p>
      ))}
    </div>
  );
}

export function ChartFigure({
  summary,
  className,
  children,
}: {
  summary: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className={cn("w-full", className)}>
      <div aria-hidden="true" className="h-full w-full">
        {children}
      </div>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}

export function RevenueAreaChart({
  data,
  name,
  format,
  formatAxis,
}: {
  data: { label: string; value: number }[];
  name: string;
  format: (v: number) => string;
  formatAxis: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} accessibilityLayer={false}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} dy={6} />
        <YAxis tickLine={false} axisLine={false} tick={axisTick} width={48} tickFormatter={formatAxis} />
        <Tooltip content={<TooltipBox format={format} />} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="value"
          name={name}
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#revenueFill)"
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({
  data,
  name,
  format,
  color = "var(--chart-1)",
  layout = "horizontal",
  colors,
}: {
  data: { label: string; value: number }[];
  name: string;
  format: (v: number) => string;
  color?: string;
  layout?: "horizontal" | "vertical";
  colors?: string[];
}) {
  const vertical = layout === "vertical";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout={vertical ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        accessibilityLayer={false}
      >
        <CartesianGrid vertical={vertical} horizontal={!vertical} stroke="var(--border)" />
        {vertical ? (
          <>
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis
              type="category"
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={axisTick}
              width={92}
            />
          </>
        ) : (
          <>
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} dy={6} />
            <YAxis tickLine={false} axisLine={false} tick={axisTick} width={44} tickFormatter={format} />
          </>
        )}
        <Tooltip content={<TooltipBox format={format} />} cursor={{ fill: "var(--muted)" }} />
        <Bar
          dataKey="value"
          name={name}
          fill={color}
          radius={vertical ? [0, 8, 8, 0] : [8, 8, 0, 0]}
          maxBarSize={44}
        >
          {colors ? data.map((d, i) => <Cell key={d.label} fill={colors[i % colors.length]} />) : null}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  format,
}: {
  data: { label: string; value: number }[];
  format: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart accessibilityLayer={false}>
        <Tooltip content={<TooltipBox format={format} />} />
        <Pie data={data} dataKey="value" nameKey="label" innerRadius="58%" outerRadius="90%" paddingAngle={2}>
          {data.map((d, i) => (
            <Cell
              key={d.label}
              fill={chartColors[i % chartColors.length]}
              stroke="var(--card)"
              strokeWidth={2}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
