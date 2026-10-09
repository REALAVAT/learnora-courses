"use client";

import { useMemo } from "react";
import { flatLessons } from "@/lib/course-utils";
import { useLearning } from "@/lib/store/learning";
import type { Course } from "@/lib/types";

export function useCourseAccess(course: Course) {
  const enrolled = useLearning((s) => Boolean(s.enrollments[course.slug]));
  const subscription = useLearning((s) => s.subscription);
  const completedIds = useLearning((s) => s.completed[course.slug]);
  const quizResult = useLearning((s) => s.quizResults[course.slug]);
  const certificate = useLearning((s) => s.certificates.find((c) => c.slug === course.slug));

  const done = useMemo(() => new Set(completedIds ?? []), [completedIds]);
  const total = flatLessons(course).length;
  const allDone = done.size >= total;
  const hasPlan = Boolean(subscription && subscription.plan !== "free");

  return {
    enrolled,
    canAccess: enrolled || course.price === 0 || hasPlan,
    done,
    total,
    allDone,
    quizResult,
    certificate,
    quizState: (quizResult?.passed ? "passed" : allDone ? "ready" : "locked") as
      "locked" | "ready" | "passed",
  };
}
