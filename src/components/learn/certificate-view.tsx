"use client";

import { ChevronLeftIcon, LinkIcon, PrinterIcon, SearchXIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { EmptyState } from "@/components/app/empty-state";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { useLearning } from "@/lib/store/learning";
import { CertificateArtwork } from "./certificate-artwork";

export function CertificateView({ id }: { id: string }) {
  const t = useTranslations("Certificate");
  const locale = useLocale() as Locale;
  const certificate = useLearning((s) => s.certificates.find((c) => c.id === id));
  const course = certificate ? getCourse(certificate.slug) : undefined;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("copied"));
    } catch {
      toast.error(window.location.href);
    }
  }

  return (
    <div className="min-h-dvh bg-muted/40 print:bg-white">
      <header className="no-print sticky top-0 z-30 border-b bg-background/85 backdrop-blur-xl">
        <div className="container-page flex h-14 items-center gap-3">
          <Link
            href="/learn/certificates"
            className="flex items-center gap-2 rounded-lg py-1 pr-2 text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ChevronLeftIcon aria-hidden="true" className="size-4" />
            <LogoMark className="size-7" />
            <span>{t("back")}</span>
          </Link>
          {certificate && course ? (
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={copyLink}>
                <LinkIcon aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{t("share")}</span>
              </Button>
              <Button size="sm" onClick={() => window.print()}>
                <PrinterIcon aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">{t("print")}</span>
              </Button>
            </div>
          ) : null}
        </div>
      </header>
      <main id="main" className="container-page py-8 sm:py-12 print:p-0">
        {certificate && course ? (
          <>
            <h1 className="sr-only">{`${t("heading")}: ${course.title[locale]}`}</h1>
            <div className="mx-auto max-w-5xl print:max-w-none">
              <CertificateArtwork certificate={certificate} course={course} locale={locale} />
            </div>
          </>
        ) : (
          <EmptyState
            icon={SearchXIcon}
            title={t("emptyTitle")}
            body={t("notFound")}
            action={{ label: t("back"), href: "/learn/certificates" }}
            className="mx-auto max-w-xl"
          />
        )}
      </main>
    </div>
  );
}
