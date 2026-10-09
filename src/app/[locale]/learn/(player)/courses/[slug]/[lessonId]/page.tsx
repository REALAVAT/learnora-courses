import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LessonView } from "@/components/learn/lesson-view";
import { routing } from "@/i18n/routing";
import { findLesson } from "@/lib/course-utils";
import { getCourse } from "@/lib/data/courses";

type Props = PageProps<"/[locale]/learn/courses/[slug]/[lessonId]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, lessonId } = await params;
  const course = getCourse(slug);
  const found = course ? findLesson(course, lessonId) : undefined;
  if (!hasLocale(routing.locales, locale) || !course || !found) return {};
  return {
    title: `${found.lesson.title[locale]} · ${course.title[locale]}`,
    robots: { index: false, follow: false },
  };
}

export default async function LessonPage({ params }: Props) {
  const { locale, slug, lessonId } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const course = getCourse(slug);
  if (!course || !findLesson(course, lessonId)) notFound();
  setRequestLocale(locale);
  return <LessonView key={lessonId} slug={slug} lessonId={lessonId} />;
}
