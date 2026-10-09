"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MegaphoneIcon, SendIcon, Trash2Icon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { useTeach } from "@/lib/store/teach";

export function TeachAnnouncementsView() {
  const t = useTranslations("TeachAnnouncements");
  const locale = useLocale() as Locale;
  const id = useId();
  const courses = useTeach((s) => s.courses);
  const announcements = useTeach((s) => s.announcements);
  const addAnnouncement = useTeach((s) => s.addAnnouncement);
  const deleteAnnouncement = useTeach((s) => s.deleteAnnouncement);

  const schema = z.object({
    courseId: z.string().min(1, t("errors.course")),
    title: z.string().trim().min(5, t("errors.title")),
    body: z.string().trim().min(20, t("errors.body")),
  });
  type Values = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { courseId: courses.find((c) => c.status === "published")?.id ?? "", title: "", body: "" },
  });

  const describedBy = (name: keyof Values) => (errors[name] ? `${id}-${name}-error` : undefined);
  const fieldError = (name: keyof Values) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="text-sm text-destructive">
        {errors[name]?.message}
      </p>
    ) : null;

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:items-start">
        <section
          aria-labelledby={`${id}-new`}
          className="rounded-3xl border bg-card p-5 sm:p-6 xl:sticky xl:top-24"
        >
          <h2 id={`${id}-new`} className="text-lg font-semibold">
            {t("newTitle")}
          </h2>
          <form
            noValidate
            className="mt-4 flex flex-col gap-4"
            onSubmit={handleSubmit(async (values) => {
              await new Promise((r) => setTimeout(r, 400));
              addAnnouncement(values);
              reset({ ...values, title: "", body: "" });
              toast.success(t("posted"));
            })}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-courseId`}>{t("course")}</Label>
              <select
                id={`${id}-courseId`}
                aria-invalid={errors.courseId ? true : undefined}
                aria-describedby={describedBy("courseId")}
                className="h-11 rounded-xl border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                {...register("courseId")}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              {fieldError("courseId")}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-title`}>{t("titleLabel")}</Label>
              <Input
                id={`${id}-title`}
                className="h-11 rounded-xl"
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={describedBy("title")}
                {...register("title")}
              />
              {fieldError("title")}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-body`}>{t("body")}</Label>
              <Textarea
                id={`${id}-body`}
                rows={5}
                className="min-h-32 rounded-xl"
                aria-invalid={errors.body ? true : undefined}
                aria-describedby={describedBy("body")}
                {...register("body")}
              />
              {fieldError("body")}
            </div>
            <Button type="submit" size="lg" disabled={isSubmitting || courses.length === 0}>
              <SendIcon aria-hidden="true" />
              {t("post")}
            </Button>
          </form>
        </section>

        {announcements.length === 0 ? (
          <EmptyState icon={MegaphoneIcon} title={t("emptyTitle")} body={t("emptyBody")} />
        ) : (
          <ul className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {announcements.map((a) => {
                const course = courses.find((c) => c.id === a.courseId);
                return (
                  <motion.li
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 24, transition: { duration: 0.15 } }}
                    className="rounded-2xl border bg-card p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-primary">{course?.title}</p>
                        <h3 className="mt-1 font-semibold">{a.title}</h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`${t("delete")}: ${a.title}`}
                        onClick={() => {
                          deleteAnnouncement(a.id);
                          toast.success(t("deleted"));
                        }}
                      >
                        <Trash2Icon aria-hidden="true" />
                      </Button>
                    </div>
                    <p className="mt-2 text-sm whitespace-pre-line text-muted-foreground">{a.body}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {formatDate(a.createdAt, locale)} · {t("recipients", { count: course?.students ?? 0 })}
                    </p>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
