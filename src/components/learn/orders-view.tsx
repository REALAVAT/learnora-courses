"use client";

import { DownloadIcon, ReceiptIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { formatDate, formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import { type Order, type OrderItem, useCommerce } from "@/lib/store/commerce";

export function OrdersView() {
  const t = useTranslations("Orders");
  const tc = useTranslations("Cart");
  const tp = useTranslations("Pricing");
  const tk = useTranslations("Checkout");
  const locale = useLocale() as Locale;
  const allOrders = useCommerce((s) => s.orders);
  const orders = [...allOrders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const itemLabel = (item: OrderItem) =>
    item.kind === "course"
      ? (getCourse(item.slug)?.title[locale] ?? item.slug)
      : tk("planLine", {
          plan: tp(`plan.${item.plan}`),
          cycle: item.cycle === "yearly" ? tk("cycleYearly") : tk("cycleMonthly"),
        });
  const money = (n: number) => formatPrice(n, locale, { cents: true });

  function downloadReceipt(order: Order) {
    const lines = [
      `${siteConfig.name} — ${t("receipt")}`,
      `${siteConfig.street}, ${siteConfig.city}, ${siteConfig.region} ${siteConfig.postalCode}`,
      "",
      `${t("order")}: ${order.id}`,
      `${t("date")}: ${formatDate(order.createdAt, locale)}`,
      `${t("status")}: ${order.status === "paid" ? t("paid") : t("refunded")}`,
      t("card", { last4: order.cardLast4 }),
      "",
      ...order.items.map((i) => `${itemLabel(i)}  ${money(i.price)}`),
      "",
      `${tc("subtotal")}: ${money(order.subtotal)}`,
      ...(order.discount ? [`${t("discount")}: −${money(order.discount)}`] : []),
      `${tc("tax")}: ${money(order.tax)}`,
      `${tc("total")}: ${money(order.total)}`,
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnora-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("receiptDownloaded"));
  }

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {orders.length === 0 ? (
        <EmptyState
          icon={ReceiptIcon}
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={{ label: t("emptyCta"), href: "/courses" }}
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl border bg-card">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-5 py-3 text-sm">
                <dl className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">{t("order")}</dt>
                    <dd className="font-mono font-medium">{order.id}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{t("date")}</dt>
                    <dd className="font-medium">{formatDate(order.createdAt, locale, "short")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{t("total")}</dt>
                    <dd className="font-medium tabular-nums">{money(order.total)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">{t("status")}</dt>
                    <dd>
                      <Badge variant={order.status === "paid" ? "secondary" : "outline"}>
                        {order.status === "paid" ? t("paid") : t("refunded")}
                      </Badge>
                    </dd>
                  </div>
                </dl>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => downloadReceipt(order)}
                  aria-label={`${t("receipt")}: ${order.id}`}
                >
                  <DownloadIcon aria-hidden="true" />
                  {t("receipt")}
                </Button>
              </div>
              <ul className="divide-y px-5">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="min-w-0">{itemLabel(item)}</span>
                    <span className="shrink-0 tabular-nums">{money(item.price)}</span>
                  </li>
                ))}
              </ul>
              <p className="border-t px-5 py-2.5 text-xs text-muted-foreground">
                {t("card", { last4: order.cardLast4 })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
