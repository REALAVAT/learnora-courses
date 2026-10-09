"use client";

import { useMemo } from "react";
import { flatLessons } from "@/lib/course-utils";
import { getCourse } from "@/lib/data/courses";
import { progressFor, useLearning } from "@/lib/store/learning";
import type { Course } from "@/lib/types";

export type EnrolledCourse = {
  course: Course;
  progress: number;
  done: number;
  total: number;
  resumeLessonId: string;
  lastVisitedAt?: string;
  enrolledAt: string;
  quizPassed: boolean;
  certificateId?: string;
};

export function useEnrolledCourses() {
  const enrollments = useLearning((s) => s.enrollments);
  const completed = useLearning((s) => s.completed);
  const quizResults = useLearning((s) => s.quizResults);
  const certificates = useLearning((s) => s.certificates);

  return useMemo(() => {
    const list: EnrolledCourse[] = [];
    for (const [slug, enrollment] of Object.entries(enrollments)) {
      const course = getCourse(slug);
      if (!course) continue;
      const lessons = flatLessons(course);
      const doneIds = completed[slug] ?? [];
      const firstOpen = lessons.find((l) => !doneIds.includes(l.id));
      list.push({
        course,
        progress: progressFor(doneIds, slug),
        done: doneIds.length,
        total: lessons.length,
        resumeLessonId: enrollment.lastLessonId ?? firstOpen?.id ?? lessons[0].id,
        lastVisitedAt: enrollment.lastVisitedAt,
        enrolledAt: enrollment.enrolledAt,
        quizPassed: Boolean(quizResults[slug]?.passed),
        certificateId: certificates.find((c) => c.slug === slug)?.id,
      });
    }
    return list.sort((a, b) =>
      (b.lastVisitedAt ?? b.enrolledAt).localeCompare(a.lastVisitedAt ?? a.enrolledAt),
    );
  }, [enrollments, completed, quizResults, certificates]);
}
