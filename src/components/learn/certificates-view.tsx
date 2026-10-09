"use client";

import { AwardIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { useLearning } from "@/lib/store/learning";
import { CertificateArtwork } from "./certificate-artwork";

export function CertificatesView() {
  const t = useTranslations("Certificate");
  const locale = useLocale() as Locale;
  const certificates = useLearning((s) => s.certificates);

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {certificates.length === 0 ? (
        <EmptyState
          icon={AwardIcon}
          title={t("emptyTitle")}
          body={t("emptyBody")}
          action={{ label: t("emptyCta"), href: "/learn/courses" }}
        />
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {certificates.map((certificate) => {
            const course = getCourse(certificate.slug);
            if (!course) return null;
            return (
              <li
                key={certificate.id}
                className="rounded-3xl border bg-card p-4 transition-shadow hover:shadow-lg"
              >
                <div aria-hidden="true" className="pointer-events-none select-none">
                  <CertificateArtwork certificate={certificate} course={course} locale={locale} />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 px-1">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{course.title[locale]}</h2>
                    <p className="font-mono text-xs text-muted-foreground">{certificate.id}</p>
                  </div>
                  <Link
                    href={`/learn/certificates/${certificate.id}`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    {t("view")}
                    <span className="sr-only">: {course.title[locale]}</span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
