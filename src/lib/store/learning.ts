"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { flatLessons } from "@/lib/course-utils";
import { getCourse } from "@/lib/data/courses";
import type { BillingCycle, PlanId } from "@/lib/types";
import { uid } from "@/lib/uid";

export type Enrollment = {
  enrolledAt: string;
  lastLessonId?: string;
  lastVisitedAt?: string;
};

export type Note = {
  id: string;
  slug: string;
  lessonId: string;
  seconds: number;
  text: string;
  createdAt: string;
};

export type QuizResult = {
  score: number;
  passed: boolean;
  takenAt: string;
  answers: number[];
};

export type Certificate = {
  id: string;
  slug: string;
  name: string;
  issuedAt: string;
};

export type Subscription = { plan: PlanId; cycle: BillingCycle; since: string };

type LearningState = {
  seeded: boolean;
  enrollments: Record<string, Enrollment>;
  completed: Record<string, string[]>;
  notes: Note[];
  quizResults: Record<string, QuizResult>;
  certificates: Certificate[];
  subscription: Subscription | null;
  enroll: (slug: string) => void;
  isEnrolled: (slug: string) => boolean;
  setLesson: (slug: string, lessonId: string, done: boolean) => void;
  visit: (slug: string, lessonId: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  deleteNote: (id: string) => void;
  submitQuiz: (slug: string, answers: number[]) => QuizResult;
  issueCertificate: (slug: string, name: string) => Certificate | undefined;
  setSubscription: (sub: Subscription | null) => void;
  seedDemo: (name: string) => void;
  reset: () => void;
};

const empty = {
  seeded: false,
  enrollments: {},
  completed: {},
  notes: [],
  quizResults: {},
  certificates: [],
  subscription: null,
} satisfies Partial<LearningState>;

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function lessonIds(slug: string, count?: number) {
  const course = getCourse(slug);
  if (!course) return [];
  const ids = flatLessons(course).map((l) => l.id);
  return count === undefined ? ids : ids.slice(0, count);
}

export function progressFor(completed: string[] | undefined, slug: string) {
  const course = getCourse(slug);
  if (!course) return 0;
  const total = flatLessons(course).length;
  return total ? Math.round(((completed?.length ?? 0) / total) * 100) : 0;
}

export const useLearning = create<LearningState>()(
  persist(
    (set, get) => ({
      ...empty,
      enroll: (slug) =>
        set((s) =>
          s.enrollments[slug]
            ? s
            : { enrollments: { ...s.enrollments, [slug]: { enrolledAt: new Date().toISOString() } } },
        ),
      isEnrolled: (slug) => Boolean(get().enrollments[slug]),
      setLesson: (slug, lessonId, done) =>
        set((s) => {
          const current = new Set(s.completed[slug] ?? []);
          if (done) current.add(lessonId);
          else current.delete(lessonId);
          return { completed: { ...s.completed, [slug]: [...current] } };
        }),
      visit: (slug, lessonId) =>
        set((s) => ({
          enrollments: {
            ...s.enrollments,
            [slug]: {
              enrolledAt: s.enrollments[slug]?.enrolledAt ?? new Date().toISOString(),
              lastLessonId: lessonId,
              lastVisitedAt: new Date().toISOString(),
            },
          },
        })),
      addNote: (note) =>
        set((s) => ({
          notes: [{ ...note, id: uid("n_"), createdAt: new Date().toISOString() }, ...s.notes],
        })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      submitQuiz: (slug, answers) => {
        const course = getCourse(slug);
        const questions = course?.quiz.questions ?? [];
        const correct = questions.filter((q, i) => answers[i] === q.answer).length;
        const score = questions.length ? Math.round((correct / questions.length) * 100) : 0;
        const result: QuizResult = {
          score,
          passed: score >= (course?.quiz.passScore ?? 70),
          takenAt: new Date().toISOString(),
          answers,
        };
        const previous = get().quizResults[slug];
        if (!previous || result.score >= previous.score || !previous.passed) {
          set((s) => ({ quizResults: { ...s.quizResults, [slug]: result } }));
        }
        return result;
      },
      issueCertificate: (slug, name) => {
        const state = get();
        const existing = state.certificates.find((c) => c.slug === slug);
        if (existing) return existing;
        const course = getCourse(slug);
        if (!course) return undefined;
        const allDone = (state.completed[slug]?.length ?? 0) >= flatLessons(course).length;
        if (!allDone || !state.quizResults[slug]?.passed) return undefined;
        const cert: Certificate = {
          id: `LRN-${uid().toUpperCase().slice(0, 8)}`,
          slug,
          name,
          issuedAt: new Date().toISOString(),
        };
        set((s) => ({ certificates: [cert, ...s.certificates] }));
        return cert;
      },
      setSubscription: (subscription) => set({ subscription }),
      seedDemo: (name) => {
        if (get().seeded) return;
        set({
          seeded: true,
          enrollments: {
            "ui-design-foundations": {
              enrolledAt: daysAgo(48),
              lastLessonId: "m3-l3",
              lastVisitedAt: daysAgo(6),
            },
            "modern-react-nextjs": {
              enrolledAt: daysAgo(21),
              lastLessonId: "m2-l2",
              lastVisitedAt: daysAgo(1),
            },
            "photography-fundamentals": {
              enrolledAt: daysAgo(30),
              lastLessonId: "m3-l3",
              lastVisitedAt: daysAgo(2),
            },
            "python-for-everyone": {
              enrolledAt: daysAgo(4),
              lastLessonId: "m1-l2",
              lastVisitedAt: daysAgo(3),
            },
          },
          completed: {
            "ui-design-foundations": lessonIds("ui-design-foundations"),
            "modern-react-nextjs": lessonIds("modern-react-nextjs", 4),
            "photography-fundamentals": lessonIds("photography-fundamentals"),
            "python-for-everyone": lessonIds("python-for-everyone", 1),
          },
          notes: [
            {
              id: "n_seed1",
              slug: "modern-react-nextjs",
              lessonId: "m1-l2",
              seconds: 312,
              text: "State updates are batched. Derive values during render instead of syncing them in effects.",
              createdAt: daysAgo(9),
            },
            {
              id: "n_seed2",
              slug: "ui-design-foundations",
              lessonId: "m2-l1",
              seconds: 145,
              text: "Use 8px steps for spacing: 8, 16, 24, 32, 48, 64.",
              createdAt: daysAgo(30),
            },
          ],
          quizResults: {
            "ui-design-foundations": {
              score: 100,
              passed: true,
              takenAt: daysAgo(6),
              answers: [1, 1, 2, 1, 1],
            },
          },
          certificates: [{ id: "LRN-7Q2K9DX4", slug: "ui-design-foundations", name, issuedAt: daysAgo(6) }],
        });
      },
      reset: () => set({ ...empty }),
    }),
    {
      name: "learnora-learning",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        seeded: s.seeded,
        enrollments: s.enrollments,
        completed: s.completed,
        notes: s.notes,
        quizResults: s.quizResults,
        certificates: s.certificates,
        subscription: s.subscription,
      }),
    },
  ),
);
