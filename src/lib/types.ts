import type { Locale } from "@/i18n/routing";

export type Localized = Record<Locale, string>;

export type CategoryId = "design" | "development" | "data" | "business" | "languages" | "photography";
export type Level = "beginner" | "intermediate" | "advanced" | "all";
export type CourseLanguage = "en" | "es";

export type Lesson = {
  id: string;
  title: Localized;
  duration: number;
  type: "video" | "article";
  preview?: boolean;
};

export type Module = {
  id: string;
  title: Localized;
  lessons: Lesson[];
};

export type QuizQuestion = {
  id: string;
  prompt: Localized;
  options: Localized[];
  answer: number;
  explanation: Localized;
};

export type Quiz = {
  id: string;
  title: Localized;
  passScore: number;
  questions: QuizQuestion[];
};

export type Course = {
  slug: string;
  title: Localized;
  subtitle: Localized;
  description: Localized;
  category: CategoryId;
  level: Level;
  language: CourseLanguage;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  students: number;
  instructorId: string;
  image: string;
  updated: string;
  outcomes: Localized[];
  requirements: Localized[];
  modules: Module[];
  quiz: Quiz;
  bestseller?: boolean;
  isNew?: boolean;
  featured?: boolean;
};

export type Instructor = {
  slug: string;
  name: string;
  role: Localized;
  bio: Localized;
  avatar: string;
  location: string;
  expertise: CategoryId[];
  yearsExperience: number;
  rating: number;
  links: { label: string; href: string }[];
};

export type Review = {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  rating: number;
  date: string;
  body: Localized;
};

export type Category = {
  id: CategoryId;
  image: string;
  description: Localized;
};

export type PlanId = "free" | "pro" | "business";
export type BillingCycle = "monthly" | "yearly";

export type Plan = {
  id: PlanId;
  monthly: number;
  yearly: number;
  highlighted?: boolean;
  features: Localized[];
};

export type CourseSummary = {
  slug: string;
  title: Localized;
  subtitle: Localized;
  category: CategoryId;
  level: Level;
  language: CourseLanguage;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  students: number;
  image: string;
  durationMinutes: number;
  lessonCount: number;
  instructor: { slug: string; name: string; avatar: string };
  bestseller?: boolean;
  isNew?: boolean;
  updated: string;
};
