import { BadgeCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { LogoMark } from "@/components/brand/logo";
import type { Locale } from "@/i18n/routing";
import { courseDuration } from "@/lib/course-utils";
import { getInstructor } from "@/lib/data/instructors";
import { formatDate, formatDuration } from "@/lib/format";
import type { Certificate } from "@/lib/store/learning";
import type { Course } from "@/lib/types";

export function CertificateArtwork({
  certificate,
  course,
  locale,
}: {
  certificate: Certificate;
  course: Course;
  locale: Locale;
}) {
  const t = useTranslations("Certificate");
  const instructor = getInstructor(course.instructorId);

  return (
    <div className="print-exact @container w-full">
      <article
        aria-label={t("heading")}
        className="relative aspect-[1.414/1] w-full overflow-hidden rounded-[2cqw] bg-white text-[oklch(0.22_0.05_282)] shadow-xl ring-1 ring-black/5 print:rounded-none print:shadow-none print:ring-0"
      >
        <div
          aria-hidden="true"
          className="absolute -top-[14cqw] -right-[10cqw] size-[38cqw] rounded-full bg-indigo-soft opacity-80"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-[16cqw] -left-[12cqw] size-[36cqw] rounded-full bg-coral-soft opacity-80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-[2.2cqw] rounded-[1.2cqw] border-[0.35cqw] border-primary/80"
        />
        <div
          aria-hidden="true"
          className="absolute inset-[3.2cqw] rounded-[0.8cqw] border-[0.12cqw] border-coral"
        />

        <div className="relative flex h-full flex-col items-center justify-between px-[9cqw] py-[7cqw] text-center">
          <div className="flex items-center gap-[1.2cqw]">
            <LogoMark className="size-[4.5cqw]" />
            <span className="text-[2.6cqw] font-semibold tracking-tight">Learnora</span>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-[1.6cqw] font-semibold tracking-[0.3em] text-primary uppercase">
              {t("heading")}
            </p>
            <p className="mt-[2.2cqw] text-[1.8cqw] text-[oklch(0.45_0.03_282)]">{t("presentedTo")}</p>
            <p className="mt-[0.8cqw] text-[5.4cqw] leading-tight font-semibold tracking-tight">
              {certificate.name}
            </p>
            <p className="mt-[1cqw] text-[1.8cqw] text-[oklch(0.45_0.03_282)]">{t("completed")}</p>
            <p className="mt-[0.8cqw] max-w-[70cqw] text-[3cqw] leading-snug font-semibold text-balance text-primary">
              {course.title[locale]}
            </p>
            <p className="mt-[0.8cqw] text-[1.5cqw] text-[oklch(0.45_0.03_282)]">
              {t("duration", { duration: formatDuration(courseDuration(course)) })}
            </p>
          </div>

          <div className="grid w-full grid-cols-3 items-end gap-[3cqw] text-[1.35cqw]">
            <div className="text-left">
              <p className="font-[cursive] text-[2.4cqw] leading-none">{instructor?.name}</p>
              <div className="mt-[0.8cqw] border-t border-[oklch(0.8_0.02_282)] pt-[0.6cqw]">
                <p className="font-medium">{instructor?.name}</p>
                <p className="text-[oklch(0.45_0.03_282)]">{t("instructor")}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="grid size-[9cqw] place-items-center rounded-full bg-primary text-white ring-[0.6cqw] ring-indigo-soft">
                <BadgeCheckIcon aria-hidden="true" className="size-[4.5cqw]" />
              </span>
              <p className="mt-[0.8cqw] font-medium">{t("verified")}</p>
            </div>
            <div className="text-right">
              <p className="font-[cursive] text-[2.4cqw] leading-none">M. Alvarez</p>
              <div className="mt-[0.8cqw] border-t border-[oklch(0.8_0.02_282)] pt-[0.6cqw]">
                <p className="font-medium">
                  {t("issued", { date: formatDate(certificate.issuedAt, locale) })}
                </p>
                <p className="text-[oklch(0.45_0.03_282)]">
                  {t("credentialId")}: <span className="font-mono">{certificate.id}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
