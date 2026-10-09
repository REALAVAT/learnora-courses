"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, LibraryIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate, formatPrice } from "@/lib/format";
import { type DraftCourse, useTeach } from "@/lib/store/teach";
import { cn } from "@/lib/utils";

function NewCourseDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations("TeachCourses");
  const tc = useTranslations("Common");
  const id = useId();
  const router = useRouter();
  const createCourse = useTeach((s) => s.createCourse);
  const schema = z.object({ title: z.string().trim().min(5, t("errors.title")) });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { title: "" } });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form
          noValidate
          className="grid gap-4"
          onSubmit={handleSubmit(({ title }) => {
            const course = createCourse(title);
            toast.success(t("created"));
            onOpenChange(false);
            router.push(`/teach/courses/${course.id}`);
          })}
        >
          <DialogHeader>
            <DialogTitle>{t("newTitle")}</DialogTitle>
            <DialogDescription>{t("newBody")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-title`}>{t("titleLabel")}</Label>
            <Input
              id={`${id}-title`}
              placeholder={t("titlePlaceholder")}
              className="h-11 rounded-xl"
              autoComplete="off"
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? `${id}-title-error` : undefined}
              {...register("title")}
            />
            {errors.title ? (
              <p id={`${id}-title-error`} className="text-sm text-destructive">
                {errors.title.message}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>{tc("cancel")}</DialogClose>
            <Button type="submit">{t("create")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CourseThumb({ course, className }: { course: DraftCourse; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {course.image ? (
        <Image
          src={course.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-indigo-soft to-coral-soft text-primary/60">
          <ImageIcon aria-hidden="true" className="size-10" />
        </div>
      )}
    </div>
  );
}

export function TeachCoursesView({ openNew = false }: { openNew?: boolean }) {
  const t = useTranslations("TeachCourses");
  const tt = useTranslations("Teach");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;
  const courses = useTeach((s) => s.courses);
  const deleteCourse = useTeach((s) => s.deleteCourse);
  const [newOpen, setNewOpen] = useState(openNew);
  const [toDelete, setToDelete] = useState<DraftCourse | null>(null);

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        action={
          <Button size="lg" onClick={() => setNewOpen(true)}>
            <PlusIcon aria-hidden="true" />
            {t("newCourse")}
          </Button>
        }
      />

      {courses.length === 0 ? (
        <EmptyState icon={LibraryIcon} title={t("emptyTitle")} body={t("emptyBody")} />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
          {courses.map((course) => {
            const lessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
            return (
              <li key={course.id} className="flex flex-col overflow-hidden rounded-2xl border bg-card">
                <div className="relative">
                  <CourseThumb course={course} className="aspect-video" />
                  <Badge
                    className={cn(
                      "absolute top-3 left-3",
                      course.status === "published"
                        ? "bg-success text-white"
                        : "bg-background text-foreground",
                    )}
                  >
                    {course.status === "published" ? tt("published") : tt("draft")}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="leading-snug font-semibold text-balance">{course.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {t("modules", { count: course.modules.length })} · {t("lessons", { count: lessons })} ·{" "}
                    {course.price === 0 ? tc("free") : formatPrice(course.price, locale)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("students", { count: course.students })} ·{" "}
                    {t("updated", { date: formatDate(course.updatedAt, locale, "short") })}
                  </p>
                  <div className="mt-auto flex gap-2 pt-3">
                    <Link
                      href={`/teach/courses/${course.id}`}
                      aria-label={`${t("edit")}: ${course.title}`}
                      className={cn(buttonVariants({ size: "sm" }), "flex-1")}
                    >
                      <PencilIcon aria-hidden="true" />
                      {t("edit")}
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      aria-label={`${t("delete")}: ${course.title}`}
                      onClick={() => setToDelete(course)}
                    >
                      <Trash2Icon aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <NewCourseDialog open={newOpen} onOpenChange={setNewOpen} />

      <Dialog open={Boolean(toDelete)} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>{t("deleteBody", { title: toDelete?.title ?? "" })}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>{tc("cancel")}</DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                if (toDelete) deleteCourse(toDelete.id);
                setToDelete(null);
                toast.success(t("deleted"));
              }}
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
