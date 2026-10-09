"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Locale } from "@/i18n/routing";
import { getCoursesByInstructor } from "@/lib/data/courses";
import type { CategoryId, Level } from "@/lib/types";
import { uid } from "@/lib/uid";

export type DraftLesson = { id: string; title: string; duration: number; type: "video" | "article" };
export type DraftModule = { id: string; title: string; lessons: DraftLesson[] };

export type DraftCourse = {
  id: string;
  sourceSlug?: string;
  title: string;
  subtitle: string;
  description: string;
  category: CategoryId;
  level: Level;
  price: number;
  image: string;
  status: "draft" | "published";
  modules: DraftModule[];
  students: number;
  revenue: number;
  rating: number;
  updatedAt: string;
};

export type Announcement = {
  id: string;
  courseId: string;
  title: string;
  body: string;
  createdAt: string;
};

type TeachState = {
  seeded: boolean;
  courses: DraftCourse[];
  announcements: Announcement[];
  createCourse: (title: string) => DraftCourse;
  updateCourse: (id: string, patch: Partial<DraftCourse>) => void;
  deleteCourse: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, "id" | "createdAt">) => void;
  deleteAnnouncement: (id: string) => void;
  seedDemo: (instructorSlug: string, locale: Locale) => void;
  reset: () => void;
};

const now = () => new Date().toISOString();

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export const useTeach = create<TeachState>()(
  persist(
    (set, get) => ({
      seeded: false,
      courses: [],
      announcements: [],
      createCourse: (title) => {
        const course: DraftCourse = {
          id: uid("c_"),
          title,
          subtitle: "",
          description: "",
          category: "design",
          level: "beginner",
          price: 49,
          image: "",
          status: "draft",
          modules: [
            {
              id: uid("m_"),
              title: "Getting started",
              lessons: [{ id: uid("l_"), title: "Welcome", duration: 5, type: "video" }],
            },
          ],
          students: 0,
          revenue: 0,
          rating: 0,
          updatedAt: now(),
        };
        set((s) => ({ courses: [course, ...s.courses] }));
        return course;
      },
      updateCourse: (id, patch) =>
        set((s) => ({
          courses: s.courses.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: now() } : c)),
        })),
      deleteCourse: (id) =>
        set((s) => ({
          courses: s.courses.filter((c) => c.id !== id),
          announcements: s.announcements.filter((a) => a.courseId !== id),
        })),
      addAnnouncement: (a) =>
        set((s) => ({ announcements: [{ ...a, id: uid("a_"), createdAt: now() }, ...s.announcements] })),
      deleteAnnouncement: (id) => set((s) => ({ announcements: s.announcements.filter((a) => a.id !== id) })),
      seedDemo: (instructorSlug, locale) => {
        if (get().seeded) return;
        const published: DraftCourse[] = getCoursesByInstructor(instructorSlug).map((c, i) => ({
          id: `c_${c.slug}`,
          sourceSlug: c.slug,
          title: c.title[locale],
          subtitle: c.subtitle[locale],
          description: c.description[locale],
          category: c.category,
          level: c.level,
          price: c.price,
          image: c.image,
          status: "published",
          modules: c.modules.map((m) => ({
            id: `${c.slug}-${m.id}`,
            title: m.title[locale],
            lessons: m.lessons.map((l) => ({
              id: `${c.slug}-${l.id}`,
              title: l.title[locale],
              duration: l.duration,
              type: l.type,
            })),
          })),
          students: c.students,
          revenue: Math.round(c.students * c.price * 0.42),
          rating: c.rating,
          updatedAt: daysAgo(10 + i * 12),
        }));
        const draft: DraftCourse = {
          id: "c_draft_motion",
          title: locale === "es" ? "Diseño de movimiento para interfaces" : "Motion Design for Interfaces",
          subtitle:
            locale === "es"
              ? "Microinteracciones que guían, informan y deleitan."
              : "Micro-interactions that guide, inform and delight.",
          description: "",
          category: "design",
          level: "intermediate",
          price: 89,
          image: "",
          status: "draft",
          modules: [
            {
              id: "m_motion_1",
              title: locale === "es" ? "Principios del movimiento" : "Principles of motion",
              lessons: [
                {
                  id: "l_motion_1",
                  title: locale === "es" ? "Por qué importa el movimiento" : "Why motion matters",
                  duration: 8,
                  type: "video",
                },
                {
                  id: "l_motion_2",
                  title: locale === "es" ? "Curvas de aceleración" : "Easing curves",
                  duration: 12,
                  type: "video",
                },
              ],
            },
          ],
          students: 0,
          revenue: 0,
          rating: 0,
          updatedAt: daysAgo(1),
        };
        set({
          seeded: true,
          courses: [draft, ...published],
          announcements: [
            {
              id: "a_seed1",
              courseId: published[0]?.id ?? draft.id,
              title: locale === "es" ? "Nueva lección sobre accesibilidad" : "New lesson on accessible color",
              body:
                locale === "es"
                  ? "He añadido una lección sobre paletas accesibles con ejemplos descargables. ¡Disfrutadla!"
                  : "I just added a lesson on accessible palettes with downloadable examples. Enjoy!",
              createdAt: daysAgo(5),
            },
          ],
        });
      },
      reset: () => set({ seeded: false, courses: [], announcements: [] }),
    }),
    { name: "learnora-teach", version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
