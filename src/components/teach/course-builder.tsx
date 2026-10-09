"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  CircleIcon,
  FileTextIcon,
  PlusIcon,
  RocketIcon,
  SaveIcon,
  SearchXIcon,
  Trash2Icon,
  UndoIcon,
  VideoIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { categories } from "@/lib/data/categories";
import { formatDate, formatPrice } from "@/lib/format";
import { type DraftCourse, type DraftLesson, type DraftModule, useTeach } from "@/lib/store/teach";
import type { CategoryId, Level } from "@/lib/types";
import { uid } from "@/lib/uid";
import { cn } from "@/lib/utils";
import { CourseThumb } from "./courses-view";

const levels: Level[] = ["beginner", "intermediate", "advanced", "all"];
const selectClass =
  "h-11 w-full rounded-xl border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm";

function move<T>(list: T[], index: number, delta: number) {
  const next = [...list];
  const target = index + delta;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
}

function CurriculumEditor({
  modules,
  onChange,
}: {
  modules: DraftModule[];
  onChange: (modules: DraftModule[]) => void;
}) {
  const t = useTranslations("Builder");
  const lessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const minutes = modules.reduce((s, m) => s + m.lessons.reduce((x, l) => x + (l.duration || 0), 0), 0);

  const updateModule = (mi: number, patch: Partial<DraftModule>) =>
    onChange(modules.map((m, i) => (i === mi ? { ...m, ...patch } : m)));
  const updateLesson = (mi: number, li: number, patch: Partial<DraftLesson>) =>
    updateModule(mi, { lessons: modules[mi].lessons.map((l, i) => (i === li ? { ...l, ...patch } : l)) });

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {t("totals", { modules: modules.length, lessons, minutes })}
      </p>
      <ol className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {modules.map((mod, mi) => (
            <motion.li
              key={mod.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
              className="rounded-2xl border bg-card"
            >
              <div className="flex items-center gap-2 border-b bg-muted/40 p-3 sm:p-4">
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
                >
                  {mi + 1}
                </span>
                <Input
                  value={mod.title}
                  onChange={(e) => updateModule(mi, { title: e.target.value })}
                  aria-label={t("moduleTitle", { index: mi + 1 })}
                  aria-invalid={!mod.title.trim() || undefined}
                  className="h-10 flex-1 rounded-xl bg-card font-medium"
                />
                <div className="flex shrink-0">
                  <IconButton
                    label={t("moveUp")}
                    disabled={mi === 0}
                    onClick={() => onChange(move(modules, mi, -1))}
                  >
                    <ArrowUpIcon aria-hidden="true" />
                  </IconButton>
                  <IconButton
                    label={t("moveDown")}
                    disabled={mi === modules.length - 1}
                    onClick={() => onChange(move(modules, mi, 1))}
                  >
                    <ArrowDownIcon aria-hidden="true" />
                  </IconButton>
                  <IconButton
                    label={t("removeModule")}
                    disabled={modules.length === 1}
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      onChange(modules.filter((_, i) => i !== mi));
                      toast.success(t("moduleRemoved"));
                    }}
                  >
                    <Trash2Icon aria-hidden="true" />
                  </IconButton>
                </div>
              </div>
              <ol className="flex flex-col divide-y">
                <AnimatePresence initial={false}>
                  {mod.lessons.map((lesson, li) => (
                    <motion.li
                      key={lesson.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      className="grid grid-cols-[auto_1fr] items-center gap-2 p-3 sm:grid-cols-[auto_1fr_auto_auto_auto] sm:px-4"
                    >
                      <IconButton
                        label={`${t("lessonType")}: ${lesson.type === "video" ? t("video") : t("article")}`}
                        onClick={() =>
                          updateLesson(mi, li, { type: lesson.type === "video" ? "article" : "video" })
                        }
                        className="text-muted-foreground"
                      >
                        {lesson.type === "video" ? (
                          <VideoIcon aria-hidden="true" />
                        ) : (
                          <FileTextIcon aria-hidden="true" />
                        )}
                      </IconButton>
                      <Input
                        value={lesson.title}
                        onChange={(e) => updateLesson(mi, li, { title: e.target.value })}
                        aria-label={`${t("lessonTitle")} ${mi + 1}.${li + 1}`}
                        aria-invalid={!lesson.title.trim() || undefined}
                        className="h-10 rounded-xl"
                      />
                      <label className="col-start-2 flex items-center gap-2 text-xs text-muted-foreground sm:col-start-auto">
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={180}
                          value={lesson.duration}
                          aria-label={`${t("lessonDuration")} ${mi + 1}.${li + 1}`}
                          onChange={(e) =>
                            updateLesson(mi, li, {
                              duration: Math.max(1, Math.min(180, Number(e.target.value) || 1)),
                            })
                          }
                          className="h-10 w-20 rounded-xl tabular-nums"
                        />
                        {t("lessonDuration")}
                      </label>
                      <div className="col-start-2 flex sm:col-span-2 sm:col-start-auto">
                        <IconButton
                          label={t("moveUp")}
                          disabled={li === 0}
                          onClick={() => updateModule(mi, { lessons: move(mod.lessons, li, -1) })}
                        >
                          <ArrowUpIcon aria-hidden="true" />
                        </IconButton>
                        <IconButton
                          label={t("moveDown")}
                          disabled={li === mod.lessons.length - 1}
                          onClick={() => updateModule(mi, { lessons: move(mod.lessons, li, 1) })}
                        >
                          <ArrowDownIcon aria-hidden="true" />
                        </IconButton>
                        <IconButton
                          label={t("removeLesson")}
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            updateModule(mi, { lessons: mod.lessons.filter((_, i) => i !== li) })
                          }
                        >
                          <Trash2Icon aria-hidden="true" />
                        </IconButton>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
              <div className="border-t p-3 sm:px-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    updateModule(mi, {
                      lessons: [
                        ...mod.lessons,
                        { id: uid("l_"), title: t("newLesson"), duration: 8, type: "video" },
                      ],
                    })
                  }
                >
                  <PlusIcon aria-hidden="true" />
                  {t("addLesson")}
                </Button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="self-start border-dashed"
        onClick={() =>
          onChange([
            ...modules,
            {
              id: uid("m_"),
              title: t("newModule"),
              lessons: [{ id: uid("l_"), title: t("newLesson"), duration: 8, type: "video" }],
            },
          ])
        }
      >
        <PlusIcon aria-hidden="true" />
        {t("addModule")}
      </Button>
    </div>
  );
}

function BuilderForm({ course }: { course: DraftCourse }) {
  const t = useTranslations("Builder");
  const tt = useTranslations("Teach");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;
  const id = useId();
  const updateCourse = useTeach((s) => s.updateCourse);
  const [tab, setTab] = useState("details");
  const [modules, setModules] = useState<DraftModule[]>(course.modules);
  const [savedModules, setSavedModules] = useState<DraftModule[]>(course.modules);

  const schema = z.object({
    title: z.string().trim().min(5, t("errors.title")),
    subtitle: z.string().trim().min(10, t("errors.subtitle")),
    description: z.string().trim().min(50, t("errors.description")),
    category: z.enum(["design", "development", "data", "business", "languages", "photography"]),
    level: z.enum(["beginner", "intermediate", "advanced", "all"]),
    price: z
      .number({ invalid_type_error: t("errors.price") })
      .min(0, t("errors.price"))
      .max(499, t("errors.price")),
  });
  type Values = z.infer<typeof schema>;
  const defaults: Values = {
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    category: course.category,
    level: course.level,
    price: course.price,
  };
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: defaults, mode: "onTouched" });
  const values = useWatch({ control }) as Partial<Values>;

  const modulesDirty = JSON.stringify(modules) !== JSON.stringify(savedModules);
  const dirty = isDirty || modulesDirty;
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const checks = [
    { key: "title", ok: (values.title ?? "").trim().length >= 5 },
    { key: "subtitle", ok: (values.subtitle ?? "").trim().length >= 10 },
    { key: "description", ok: (values.description ?? "").trim().length >= 50 },
    { key: "modules", ok: modules.length >= 2 },
    { key: "lessons", ok: totalLessons >= 3 },
    { key: "titles", ok: modules.every((m) => m.title.trim() && m.lessons.every((l) => l.title.trim())) },
    { key: "saved", ok: !dirty },
  ] as const;
  const ready = checks.every((c) => c.ok);

  const save = handleSubmit(
    (data) => {
      updateCourse(course.id, { ...data, modules });
      reset(data);
      setSavedModules(modules);
      toast.success(t("saved"));
    },
    () => setTab("details"),
  );

  function togglePublish() {
    if (course.status === "published") {
      updateCourse(course.id, { status: "draft" });
      toast.success(t("unpublished"));
      return;
    }
    if (!ready) {
      toast.error(t("publishBlocked"));
      return;
    }
    updateCourse(course.id, { status: "published" });
    toast.success(t("published"));
  }

  const fieldProps = (name: keyof Values) => ({
    id: `${id}-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby":
      [
        errors[name] ? `${id}-${name}-error` : "",
        name === "description" || name === "price" ? `${id}-${name}-hint` : "",
      ]
        .filter(Boolean)
        .join(" ") || undefined,
  });
  const fieldError = (name: keyof Values) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="text-sm text-destructive">
        {errors[name]?.message}
      </p>
    ) : null;

  return (
    <div>
      <Link
        href="/teach/courses"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ChevronLeftIcon aria-hidden="true" className="size-4" />
        {t("back")}
      </Link>
      <header className="z-20 -mx-4 mb-6 flex flex-col gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 md:sticky md:top-16 lg:mx-0 lg:flex-row lg:items-center lg:justify-between lg:rounded-2xl lg:border lg:px-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={course.status === "published" ? "bg-success text-white" : undefined}
              variant={course.status === "published" ? "default" : "outline"}
            >
              <span className="sr-only">{t("statusLabel")}: </span>
              {course.status === "published" ? tt("published") : tt("draft")}
            </Badge>
            <span className="text-xs text-muted-foreground" aria-live="polite">
              {dirty ? t("unsaved") : t("lastSaved", { date: formatDate(course.updatedAt, locale, "short") })}
            </span>
          </div>
          <h1 className="mt-1 truncate text-xl font-semibold tracking-tight sm:text-2xl">
            {values.title || course.title}
          </h1>
        </div>
        <div className="flex shrink-0 gap-2">
          {dirty ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                reset(defaults);
                setModules(savedModules);
              }}
            >
              <UndoIcon aria-hidden="true" />
              {tc("cancel")}
            </Button>
          ) : null}
          <Button type="button" variant="outline" onClick={save} disabled={!dirty}>
            <SaveIcon aria-hidden="true" />
            {t("save")}
          </Button>
          <Button
            type="button"
            onClick={togglePublish}
            variant={course.status === "published" ? "secondary" : "default"}
          >
            <RocketIcon aria-hidden="true" />
            {course.status === "published" ? t("unpublish") : t("publish")}
          </Button>
        </div>
      </header>

      <div className="grid gap-8 xl:grid-cols-[1fr_300px]">
        <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="min-w-0">
          <TabsList variant="line" className="mb-5">
            <TabsTrigger value="details">{t("details")}</TabsTrigger>
            <TabsTrigger value="curriculum">
              {t("curriculum")}
              <span className="ml-1.5 rounded-full bg-secondary px-1.5 text-xs tabular-nums">
                {totalLessons}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void save();
              }}
              className="grid gap-5 rounded-3xl border bg-card p-5 sm:grid-cols-2 sm:p-6"
            >
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor={`${id}-title`}>{t("title")}</Label>
                <Input {...fieldProps("title")} className="h-11 rounded-xl" {...register("title")} />
                {fieldError("title")}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor={`${id}-subtitle`}>{t("subtitle")}</Label>
                <Input {...fieldProps("subtitle")} className="h-11 rounded-xl" {...register("subtitle")} />
                {fieldError("subtitle")}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor={`${id}-description`}>{t("description")}</Label>
                <Textarea
                  {...fieldProps("description")}
                  rows={5}
                  className="min-h-32 rounded-xl"
                  {...register("description")}
                />
                <p id={`${id}-description-hint`} className="text-xs text-muted-foreground">
                  {t("descriptionHint")}{" "}
                  <span className="tabular-nums">({(values.description ?? "").trim().length}/50)</span>
                </p>
                {fieldError("description")}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${id}-category`}>{t("category")}</Label>
                <select {...fieldProps("category")} className={selectClass} {...register("category")}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {tc(`category.${c.id as CategoryId}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${id}-level`}>{t("level")}</Label>
                <select {...fieldProps("level")} className={selectClass} {...register("level")}>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {tc(`level.${l}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`${id}-price`}>{t("price")}</Label>
                <Input
                  {...fieldProps("price")}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={499}
                  step={1}
                  className="h-11 rounded-xl tabular-nums"
                  {...register("price", { valueAsNumber: true })}
                />
                <p id={`${id}-price-hint`} className="text-xs text-muted-foreground">
                  {t("priceHint")}
                </p>
                {fieldError("price")}
              </div>
            </form>
          </TabsContent>
          <TabsContent value="curriculum">
            <CurriculumEditor modules={modules} onChange={setModules} />
          </TabsContent>
        </Tabs>

        <aside className="flex flex-col gap-6 xl:sticky xl:top-40 xl:self-start">
          <section aria-labelledby={`${id}-checklist`} className="rounded-3xl border bg-card p-5">
            <h2 id={`${id}-checklist`} className="font-semibold">
              {t("publishChecklist")}
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {checks.map((c) => (
                <li
                  key={c.key}
                  className={cn("flex items-start gap-2", c.ok ? "text-foreground" : "text-muted-foreground")}
                >
                  {c.ok ? (
                    <CheckCircle2Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  ) : (
                    <CircleIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  )}
                  <span>
                    <span className="sr-only">{c.ok ? "✓ " : "○ "}</span>
                    {t(`check.${c.key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby={`${id}-preview`} className="overflow-hidden rounded-3xl border bg-card">
            <h2 id={`${id}-preview`} className="sr-only">
              {t("preview")}
            </h2>
            <CourseThumb course={course} className="aspect-video" />
            <div className="p-5">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                {values.category ? tc(`category.${values.category}`) : null}
              </p>
              <p className="mt-1 leading-snug font-semibold">{values.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{values.subtitle}</p>
              <p className="mt-3 font-semibold">
                {!values.price ? tc("free") : formatPrice(Number(values.price) || 0, locale)}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function CourseBuilder({ id }: { id: string }) {
  const t = useTranslations("Builder");
  const course = useTeach((s) => s.courses.find((c) => c.id === id));
  if (!course) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title={t("notFound")}
        body=""
        action={{ label: t("back"), href: "/teach/courses" }}
      />
    );
  }
  return <BuilderForm key={course.id} course={course} />;
}
