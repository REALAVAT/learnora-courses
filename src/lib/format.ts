const intlLocale = (locale: string) => (locale === "es" ? "es-US" : "en-US");

export function formatPrice(amount: number, locale: string, opts: { cents?: boolean } = {}) {
  const fraction = opts.cents || amount % 1 !== 0 ? 2 : 0;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  }).format(amount);
}

export function formatNumber(value: number, locale: string, compact = false) {
  return new Intl.NumberFormat(intlLocale(locale), compact ? { notation: "compact", maximumFractionDigits: 1 } : {}).format(
    value,
  );
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function formatDate(iso: string, locale: string, style: "short" | "long" = "long") {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: "America/New_York",
    ...(style === "long" ? { dateStyle: "long" } : { month: "short", day: "numeric", year: "numeric" }),
  }).format(new Date(iso));
}

export function formatTimestamp(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
