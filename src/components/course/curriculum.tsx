"use client";

import { ClipboardCheckIcon, FileTextIcon, PlayCircleIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Locale } from "@/i18n/routing";
import { courseDuration, flatLessons } from "@/lib/course-utils";
import { formatDuration } from "@/lib/format";
import type { Module } from "@/lib/types";
import { TrailerDialog } from "./trailer-dialog";

export function Curriculum({
  modules,
  poster,
  quizQuestions,
}: {
  modules: Module[];
  poster: string;
  quizQuestions: number;
}) {
  const t = useTranslations("Course");
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState<string[]>([modules[0]?.id ?? ""]);
  const allOpen = open.length === modules.length;
  const total = courseDuration({ modules });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {t("curriculumSummary", {
            modules: modules.length,
            lessons: flatLessons({ modules }).length,
            duration: formatDuration(total),
          })}
        </p>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? [] : modules.map((m) => m.id))}
          className="text-sm font-medium text-primary hover:underline"
        >
          {allOpen ? t("collapseAll") : t("expandAll")}
        </button>
      </div>
      <Accordion
        multiple
        value={open}
        onValueChange={(v) => setOpen(v as string[])}
        className="overflow-hidden rounded-2xl border bg-card"
      >
        {modules.map((module, mi) => {
          const minutes = module.lessons.reduce((s, l) => s + l.duration, 0);
          return (
            <AccordionItem key={module.id} value={module.id} className="border-b last:border-b-0">
              <AccordionTrigger className="items-center rounded-none bg-muted/60 px-5 py-4 hover:no-underline">
                <span className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:pr-4">
                  <span className="text-[0.95rem] font-semibold">
                    {mi + 1}. {module.title[locale]}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {t("includesLessons", { count: module.lessons.length })} · {formatDuration(minutes)}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <ul className="divide-y">
                  {module.lessons.map((lesson) => {
                    const Icon = lesson.type === "article" ? FileTextIcon : PlayCircleIcon;
                    return (
                      <li key={lesson.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                        <Icon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                        <span className="sr-only">{lesson.type === "article" ? t("article") : t("video")}:</span>
                        <span className="flex-1">{lesson.title[locale]}</span>
                        {lesson.preview && lesson.type === "video" ? (
                          <TrailerDialog
                            poster={poster}
                            title={lesson.title[locale]}
                            durationSec={lesson.duration * 60}
                            variant="link"
                            label={t("preview")}
                          />
                        ) : null}
                        <span className="w-14 text-right text-xs text-muted-foreground tabular-nums">
                          {lesson.duration} min
                        </span>
                      </li>
                    );
                  })}
                  {mi === modules.length - 1 ? (
                    <li className="flex items-center gap-3 px-5 py-3 text-sm">
                      <ClipboardCheckIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
                      <span className="flex-1 font-medium">{t("quizItem", { count: quizQuestions })}</span>
                    </li>
                  ) : null}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
