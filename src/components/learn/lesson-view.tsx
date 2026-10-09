"use client";

import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  ClipboardCheckIcon,
  DownloadIcon,
  FileTextIcon,
  LockIcon,
  PartyPopperIcon,
  Trash2Icon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { buildChapters, type PlayerApi, VideoPlayer } from "@/components/player/video-player";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { findLesson, lessonNeighbors } from "@/lib/course-utils";
import { getCourse } from "@/lib/data/courses";
import { getInstructor } from "@/lib/data/instructors";
import { formatTimestamp } from "@/lib/format";
import { useLearning } from "@/lib/store/learning";
import { usePrefs } from "@/lib/store/prefs";
import { cn } from "@/lib/utils";
import { PlayerCurriculum } from "./player-curriculum";
import { PlayerTopBar } from "./player-top-bar";
import { useCourseAccess } from "./use-course-access";

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function LessonView({ slug, lessonId }: { slug: string; lessonId: string }) {
  const t = useTranslations("Lesson");
  const tp = useTranslations("Player");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const course = getCourse(slug)!;
  const found = findLesson(course, lessonId)!;
  const { lesson, module } = found;
  const { prev, next, index, total } = lessonNeighbors(course, lessonId);
  const access = useCourseAccess(course);
  const instructor = getInstructor(course.instructorId);

  const enroll = useLearning((s) => s.enroll);
  const visit = useLearning((s) => s.visit);
  const setLesson = useLearning((s) => s.setLesson);
  const addNote = useLearning((s) => s.addNote);
  const deleteNote = useLearning((s) => s.deleteNote);
  const allNotes = useLearning((s) => s.notes);
  const autoplay = usePrefs((s) => s.autoplay);

  const notes = allNotes
    .filter((n) => n.slug === slug && n.lessonId === lessonId)
    .sort((a, b) => a.seconds - b.seconds);
  const isDone = access.done.has(lessonId);
  const durationSec = lesson.duration * 60;
  const chapters = buildChapters(durationSec);
  const player = useRef<PlayerApi>(null);
  const [time, setTime] = useState(0);
  const [noteText, setNoteText] = useState("");
  const [tab, setTab] = useState("overview");
  const noteId = useId();

  useEffect(() => {
    if (!access.canAccess) return;
    if (!access.enrolled) enroll(slug);
    visit(slug, lessonId);
  }, [access.canAccess, access.enrolled, enroll, visit, slug, lessonId]);

  if (!access.canAccess) {
    return (
      <div className="grid min-h-dvh place-items-center p-6">
        <div className="max-w-md text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-soft text-primary">
            <LockIcon aria-hidden="true" className="size-7" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold">{course.title[locale]}</h1>
          <p className="mt-2 text-muted-foreground">{t("notEnrolled")}</p>
          <Link href={`/courses/${slug}`} className={cn(buttonVariants({ size: "xl" }), "mt-6")}>
            {t("enrollNow")}
          </Link>
        </div>
      </div>
    );
  }

  function toggleComplete() {
    setLesson(slug, lessonId, !isDone);
    toast.success(isDone ? t("markedIncomplete") : t("markedComplete"));
  }

  function handleEnded() {
    if (!useLearning.getState().completed[slug]?.includes(lessonId)) {
      setLesson(slug, lessonId, true);
      toast.success(t("autoComplete"));
    }
    if (autoplay && next) {
      setTimeout(() => router.push(`/learn/courses/${slug}/${next.id}`), 1200);
    }
  }

  function saveNote() {
    const text = noteText.trim();
    if (!text) return;
    addNote({ slug, lessonId, seconds: Math.round(player.current?.getTime() ?? time), text });
    setNoteText("");
    toast.success(t("noteSaved"));
  }

  function seek(seconds: number) {
    player.current?.seek(seconds);
    player.current?.play();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const resources = [
    {
      key: "cheat",
      label: t("cheatSheet"),
      file: `${slug}-${lessonId}-cheat-sheet.txt`,
      content: [
        `Learnora · ${course.title[locale]}`,
        `${module.title[locale]} · ${lesson.title[locale]}`,
        "",
        ...course.outcomes.map((o) => `• ${o[locale]}`),
        "",
        "learnora demo · courses.ahmadkhajeh.com",
      ].join("\n"),
    },
    {
      key: "exercise",
      label: t("exerciseFiles"),
      file: `${slug}-${lessonId}-exercise.txt`,
      content: [
        `${t("articleExercise")} · ${lesson.title[locale]}`,
        "",
        t("articleExerciseBody"),
        "",
        "learnora demo · courses.ahmadkhajeh.com",
      ].join("\n"),
    },
  ];

  const currentChapter = [...chapters].reverse().find((c) => time >= c.start) ?? chapters[0];

  return (
    <>
      <PlayerTopBar
        course={course}
        done={access.done}
        currentLessonId={lessonId}
        quizState={access.quizState}
        quizScore={access.quizResult?.score}
      />
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <main id="main" className="min-w-0">
          {lesson.type === "video" ? (
            <div className="sticky top-14 z-20 bg-black lg:static">
              <div className="mx-auto max-w-6xl">
                <VideoPlayer
                  apiRef={player}
                  poster={course.image}
                  title={lesson.title[locale]}
                  label={tp("playLesson", { title: lesson.title[locale] })}
                  durationSec={durationSec}
                  onProgress={setTime}
                  onEnded={handleEnded}
                />
              </div>
            </div>
          ) : (
            <div className="border-b bg-gradient-to-br from-indigo-soft to-background px-5 py-10 sm:px-8">
              <div className="mx-auto max-w-3xl">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <FileTextIcon aria-hidden="true" className="size-4" />
                  {t("articleIntro", { minutes: lesson.duration })}
                </p>
                <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-foreground/85">
                  <p>{t("articleBody1")}</p>
                  <p>{t("articleBody2")}</p>
                  <div className="rounded-2xl border bg-card p-5">
                    <p className="font-semibold text-foreground">{t("articleExercise")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t("articleExerciseBody")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  {module.title[locale]} · {index + 1}/{total}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-balance">
                  {lesson.title[locale]}
                </h1>
              </div>
              <Button
                size="lg"
                variant={isDone ? "secondary" : "default"}
                onClick={toggleComplete}
                aria-pressed={isDone}
                className={cn("shrink-0", isDone && "text-success")}
              >
                {isDone ? <CheckCircle2Icon aria-hidden="true" /> : <CircleIcon aria-hidden="true" />}
                {isDone ? t("completed") : t("markComplete")}
              </Button>
            </div>

            {access.allDone && !access.quizResult?.passed ? (
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/25 bg-indigo-soft p-5 sm:flex-row sm:items-center">
                <PartyPopperIcon aria-hidden="true" className="size-8 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="font-semibold">{t("courseCompleteTitle")}</p>
                  <p className="text-sm text-muted-foreground">{t("courseCompleteBody")}</p>
                </div>
                <Link href={`/learn/courses/${slug}/quiz`} className={buttonVariants({ size: "lg" })}>
                  <ClipboardCheckIcon aria-hidden="true" />
                  {t("finalQuiz")}
                </Link>
              </div>
            ) : null}

            <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="mt-6">
              <TabsList
                variant="line"
                className="w-full [scrollbar-width:none] justify-start overflow-x-auto border-b pb-1"
              >
                <TabsTrigger value="overview" className="flex-none px-3">
                  {t("tabs.overview")}
                </TabsTrigger>
                {lesson.type === "video" ? (
                  <TabsTrigger value="chapters" className="flex-none px-3">
                    {t("tabs.chapters")}
                  </TabsTrigger>
                ) : null}
                <TabsTrigger value="notes" className="flex-none px-3">
                  {t("tabs.notes")}
                  {notes.length ? (
                    <span className="rounded-full bg-secondary px-1.5 text-xs text-primary">
                      {notes.length}
                    </span>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex-none px-3">
                  {t("tabs.resources")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="pt-5">
                <h2 className="text-lg font-semibold">{t("overviewTitle")}</h2>
                <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">
                  {t("overviewBody", { course: course.title[locale], lesson: lesson.title[locale] })}
                </p>
                {instructor ? (
                  <p className="mt-4 text-sm">
                    <Link
                      href={`/instructors/${instructor.slug}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {instructor.name}
                    </Link>{" "}
                    <span className="text-muted-foreground">· {instructor.role[locale]}</span>
                  </p>
                ) : null}
              </TabsContent>

              {lesson.type === "video" ? (
                <TabsContent value="chapters" className="pt-5">
                  <ol className="flex flex-col gap-1">
                    {chapters.map((c) => (
                      <li key={c.key}>
                        <button
                          type="button"
                          onClick={() => seek(c.start)}
                          aria-current={currentChapter.key === c.key ? "step" : undefined}
                          className={cn(
                            "flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary",
                            currentChapter.key === c.key && "bg-indigo-soft font-medium",
                          )}
                        >
                          <span className="w-12 font-mono text-xs text-primary tabular-nums">
                            {formatTimestamp(c.start)}
                          </span>
                          {tp(`chapter.${c.key}`)}
                        </button>
                      </li>
                    ))}
                  </ol>
                </TabsContent>
              ) : null}

              <TabsContent value="notes" className="pt-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveNote();
                  }}
                  className="flex flex-col gap-2"
                >
                  <label htmlFor={noteId} className="sr-only">
                    {t("notesLabel")}
                  </label>
                  <Textarea
                    id={noteId}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveNote();
                    }}
                    placeholder={t("notesPlaceholder", { time: formatTimestamp(time) })}
                    rows={3}
                    maxLength={600}
                    className="rounded-xl"
                  />
                  <Button type="submit" size="lg" className="self-end" disabled={!noteText.trim()}>
                    {t("addNote")}
                  </Button>
                </form>
                {notes.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">{t("noNotes")}</p>
                ) : (
                  <ul className="mt-5 flex flex-col gap-3">
                    {notes.map((note) => (
                      <li key={note.id} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                        <button
                          type="button"
                          onClick={() => seek(note.seconds)}
                          aria-label={t("jumpTo", { time: formatTimestamp(note.seconds) })}
                          className="rounded-md bg-indigo-soft px-2 py-1 font-mono text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          {formatTimestamp(note.seconds)}
                        </button>
                        <p className="flex-1 text-sm leading-relaxed whitespace-pre-line">{note.text}</p>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t("deleteNote")}
                          onClick={() => {
                            deleteNote(note.id);
                            toast.success(t("noteDeleted"));
                          }}
                        >
                          <Trash2Icon aria-hidden="true" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="resources" className="pt-5">
                <p className="text-sm text-muted-foreground">{t("resourcesIntro")}</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {resources.map((r) => (
                    <li key={r.key} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                      <span className="grid size-10 place-items-center rounded-lg bg-coral-soft text-coral-strong">
                        <FileTextIcon aria-hidden="true" className="size-5" />
                      </span>
                      <span className="flex-1 text-sm font-medium">
                        {r.label}
                        <span className="block text-xs font-normal text-muted-foreground">TXT</span>
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          downloadText(r.file, r.content);
                          toast.success(t("downloaded"));
                        }}
                      >
                        <DownloadIcon aria-hidden="true" />
                        {t("download")}
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>

            <div className="mt-10 flex items-center justify-between gap-3 border-t pt-6">
              {prev ? (
                <Link
                  href={`/learn/courses/${slug}/${prev.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "max-w-[48%]")}
                >
                  <ChevronLeftIcon aria-hidden="true" />
                  <span className="truncate">{t("previous")}</span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/learn/courses/${slug}/${next.id}`}
                  className={cn(buttonVariants({ size: "lg" }), "max-w-[60%]")}
                >
                  <span className="truncate">
                    <span className="sr-only sm:not-sr-only">{t("nextUp")}: </span>
                    {next.title[locale]}
                  </span>
                  <ChevronRightIcon aria-hidden="true" />
                </Link>
              ) : (
                <Link href={`/learn/courses/${slug}/quiz`} className={buttonVariants({ size: "lg" })}>
                  <ClipboardCheckIcon aria-hidden="true" />
                  {t("finalQuiz")}
                </Link>
              )}
            </div>
          </div>
        </main>

        <aside className="hidden border-l bg-card lg:block">
          <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto">
            <div className="border-b px-4 py-4">
              <h2 className="font-semibold">{t("curriculum")}</h2>
              <p className="text-xs text-muted-foreground">
                {t("courseProgress", { done: access.done.size, total: access.total })}
              </p>
            </div>
            <PlayerCurriculum
              course={course}
              currentLessonId={lessonId}
              done={access.done}
              quizState={access.quizState}
              quizScore={access.quizResult?.score}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
