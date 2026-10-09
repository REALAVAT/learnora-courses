import { getInstructor } from "@/lib/data/instructors";
import type { Course, CourseSummary, Lesson, Module } from "@/lib/types";

export function flatLessons(course: { modules: Module[] }): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export function courseDuration(course: { modules: Module[] }) {
  return flatLessons(course).reduce((sum, l) => sum + l.duration, 0);
}

export function lessonCount(course: { modules: Module[] }) {
  return flatLessons(course).length;
}

export function toSummary(course: Course): CourseSummary {
  const instructor = getInstructor(course.instructorId);
  return {
    slug: course.slug,
    title: course.title,
    subtitle: course.subtitle,
    category: course.category,
    level: course.level,
    language: course.language,
    price: course.price,
    originalPrice: course.originalPrice,
    rating: course.rating,
    ratingCount: course.ratingCount,
    students: course.students,
    image: course.image,
    durationMinutes: courseDuration(course),
    lessonCount: lessonCount(course),
    instructor: {
      slug: instructor?.slug ?? course.instructorId,
      name: instructor?.name ?? "",
      avatar: instructor?.avatar ?? "",
    },
    bestseller: course.bestseller,
    isNew: course.isNew,
    updated: course.updated,
  };
}

export function lessonNeighbors(course: Course, lessonId: string) {
  const lessons = flatLessons(course);
  const index = lessons.findIndex((l) => l.id === lessonId);
  return {
    index,
    total: lessons.length,
    prev: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}

export function findLesson(course: Course, lessonId: string) {
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) return { module: mod, lesson };
  }
  return undefined;
}
