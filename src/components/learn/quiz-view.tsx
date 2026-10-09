"use client";

import {
  AwardIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LockIcon,
  RotateCcwIcon,
  XCircleIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";
import { useAuth } from "@/lib/store/auth";
import { type QuizResult, useLearning } from "@/lib/store/learning";
import { cn } from "@/lib/utils";
import { PlayerTopBar } from "./player-top-bar";
import { useCourseAccess } from "./use-course-access";

export function QuizView({ slug }: { slug: string }) {
  const t = useTranslations("Quiz");
  const locale = useLocale() as Locale;
  const course = getCourse(slug)!;
  const quiz = course.quiz;
  const access = useCourseAccess(course);
  const user = useAuth((s) => s.user);
  const submitQuiz = useLearning((s) => s.submitQuiz);
  const issueCertificate = useLearning((s) => s.issueCertificate);

  const [answers, setAnswers] = useState<(number | undefined)[]>(() => quiz.questions.map(() => undefined));
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [certificateId, setCertificateId] = useState<string | undefined>(access.certificate?.id);

  const total = quiz.questions.length;
  const answered = answers.filter((a) => a !== undefined).length;
  const question = quiz.questions[step];

  function submit() {
    if (answers.some((a) => a === undefined)) {
      toast.error(t("unanswered"));
      return;
    }
    const res = submitQuiz(slug, answers as number[]);
    setResult(res);
    if (res.passed) {
      const cert = issueCertificate(slug, user?.name ?? "Learner");
      setCertificateId(cert?.id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function retake() {
    setAnswers(quiz.questions.map(() => undefined));
    setStep(0);
    setResult(null);
  }

  const topBar = (
    <PlayerTopBar
      course={course}
      done={access.done}
      quizState={access.quizState}
      quizScore={access.quizResult?.score}
    />
  );

  if (!access.canAccess || !access.allDone) {
    const resumeId = course.modules.flatMap((m) => m.lessons).find((l) => !access.done.has(l.id))?.id;
    return (
      <>
        {topBar}
        <main id="main" className="grid min-h-[calc(100dvh-3.5rem)] place-items-center p-6">
          <div className="max-w-md text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-soft text-primary">
              <LockIcon aria-hidden="true" className="size-7" />
            </span>
            <h1 className="mt-5 text-2xl font-semibold">{t("lockedTitle")}</h1>
            <p className="mt-2 text-muted-foreground">
              {t("lockedBody", { total: access.total, done: access.done.size })}
            </p>
            <Link
              href={access.canAccess && resumeId ? `/learn/courses/${slug}/${resumeId}` : `/courses/${slug}`}
              className={cn(buttonVariants({ size: "xl" }), "mt-6")}
            >
              {t("continueLessons")}
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {topBar}
      <main id="main" className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {t("title", { course: course.title[locale] })}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("intro", { count: total, score: quiz.passScore })}</p>
        </header>

        {result ? (
          <section aria-live="polite">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col items-center rounded-3xl border p-8 text-center",
                result.passed ? "border-success/30 bg-success/10" : "border-coral/40 bg-coral-soft",
              )}
            >
              <span
                className={cn(
                  "grid size-16 place-items-center rounded-full",
                  result.passed ? "bg-success text-white" : "bg-coral text-foreground",
                )}
              >
                {result.passed ? (
                  <AwardIcon aria-hidden="true" className="size-8" />
                ) : (
                  <RotateCcwIcon aria-hidden="true" className="size-8" />
                )}
              </span>
              <h2 className="mt-4 text-2xl font-semibold">
                {result.passed ? t("passedTitle") : t("failedTitle")}
              </h2>
              <p className="mt-1 text-lg font-medium">
                {t("scoreLine", { score: result.score, pass: quiz.passScore })}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.passed ? t("passedBody") : t("failedBody")}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {result.passed && certificateId ? (
                  <Link
                    href={`/learn/certificates/${certificateId}`}
                    className={buttonVariants({ size: "xl" })}
                  >
                    <AwardIcon aria-hidden="true" />
                    {t("getCertificate")}
                  </Link>
                ) : null}
                <Button size="xl" variant="outline" onClick={retake}>
                  <RotateCcwIcon aria-hidden="true" />
                  {t("retake")}
                </Button>
              </div>
            </motion.div>

            <ol className="mt-8 flex flex-col gap-4">
              {quiz.questions.map((q, qi) => {
                const chosen = result.answers[qi];
                const correct = chosen === q.answer;
                return (
                  <li key={q.id} className="rounded-2xl border bg-card p-5">
                    <div className="flex items-start gap-3">
                      {correct ? (
                        <CheckCircle2Icon
                          aria-hidden="true"
                          className="mt-0.5 size-5 shrink-0 text-success"
                        />
                      ) : (
                        <XCircleIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-destructive" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">
                          <span className="sr-only">{correct ? t("correct") : t("incorrect")}: </span>
                          {qi + 1}. {q.prompt[locale]}
                        </p>
                        <p className="mt-2 text-sm">
                          <span className="text-muted-foreground">{t("yourAnswer")}: </span>
                          <span className={correct ? "text-success" : "text-destructive"}>
                            {q.options[chosen]?.[locale]}
                          </span>
                        </p>
                        <p className="mt-2 rounded-xl bg-muted/70 p-3 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{t("explanation")}: </span>
                          {q.explanation[locale]}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : (
          <section>
            {access.quizResult?.passed && access.certificate ? (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-success/30 bg-success/10 p-4 sm:flex-row sm:items-center">
                <AwardIcon aria-hidden="true" className="size-6 shrink-0 text-success" />
                <p className="flex-1 text-sm font-medium">
                  {t("scoreLine", { score: access.quizResult.score, pass: quiz.passScore })}
                </p>
                <Link
                  href={`/learn/certificates/${access.certificate.id}`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  {t("viewCertificate")}
                </Link>
              </div>
            ) : null}

            <div className="mb-5 flex items-center justify-between gap-4 text-sm">
              <span className="font-medium">{t("question", { current: step + 1, total })}</span>
              <Progress
                value={(answered / total) * 100}
                aria-label={`${answered}/${total}`}
                className="w-40"
              />
            </div>

            <motion.fieldset
              key={question.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border bg-card p-6 sm:p-8"
            >
              <legend className="sr-only">{question.prompt[locale]}</legend>
              <p aria-hidden="true" className="text-lg font-semibold text-balance sm:text-xl">
                {question.prompt[locale]}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                {question.options.map((option, oi) => {
                  const selected = answers[step] === oi;
                  return (
                    <label
                      key={option.en}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50 sm:text-base",
                        selected
                          ? "border-primary bg-indigo-soft"
                          : "border-border hover:border-primary/40 hover:bg-muted/50",
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={oi}
                        checked={selected}
                        onChange={() => setAnswers((prev) => prev.map((a, i) => (i === step ? oi : a)))}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full border-2 text-xs font-semibold",
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
                        )}
                      >
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {option[locale]}
                    </label>
                  );
                })}
              </div>
            </motion.fieldset>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button variant="outline" size="lg" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
                <ChevronLeftIcon aria-hidden="true" />
                {t("previous")}
              </Button>
              {step < total - 1 ? (
                <Button
                  size="lg"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={answers[step] === undefined}
                >
                  {t("next")}
                  <ChevronRightIcon aria-hidden="true" />
                </Button>
              ) : (
                <Button size="lg" onClick={submit} disabled={answered < total}>
                  {t("submit")}
                </Button>
              )}
            </div>
            <ol className="mt-6 flex justify-center gap-1">
              {quiz.questions.map((q, i) => (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-label={t("question", { current: i + 1, total })}
                    aria-current={i === step ? "step" : undefined}
                    className="grid size-7 place-items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span
                      className={cn(
                        "size-3 rounded-full transition-colors",
                        i === step
                          ? "bg-primary"
                          : answers[i] !== undefined
                            ? "bg-primary/40"
                            : "bg-secondary",
                      )}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </>
  );
}
