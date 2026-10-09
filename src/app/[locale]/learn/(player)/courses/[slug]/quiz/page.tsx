import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { QuizView } from "@/components/learn/quiz-view";
import { routing } from "@/i18n/routing";
import { getCourse } from "@/lib/data/courses";

type Props = PageProps<"/[locale]/learn/courses/[slug]/quiz">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const course = getCourse(slug);
  if (!hasLocale(routing.locales, locale) || !course) return {};
  const t = await getTranslations({ locale, namespace: "Quiz" });
  return {
    title: `${t("metaTitle")} · ${course.title[locale]}`,
    robots: { index: false, follow: false },
  };
}

export default async function QuizPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  if (!getCourse(slug)) notFound();
  setRequestLocale(locale);
  return <QuizView slug={slug} />;
}
