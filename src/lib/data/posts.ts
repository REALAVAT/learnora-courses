import { unsplash } from "@/lib/images";
import type { Localized } from "@/lib/types";

export type Post = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  image: string;
  imageAlt: Localized;
  authorId: string;
  date: string;
  readMinutes: number;
  tags: Localized[];
  relatedCourse?: string;
};

export const posts: Post[] = [
  {
    slug: "how-to-finish-an-online-course",
    title: {
      en: "How to actually finish an online course: 6 habits backed by learning science",
      es: "Cómo terminar de verdad un curso online: 6 hábitos respaldados por la ciencia del aprendizaje",
    },
    excerpt: {
      en: "Most people never finish the courses they start. These small, research-backed habits change that, without needing more willpower.",
      es: "La mayoría nunca termina los cursos que empieza. Estos pequeños hábitos, respaldados por la investigación, lo cambian sin necesitar más fuerza de voluntad.",
    },
    image: unsplash("1434030216411-0b793f4b4173", 1600),
    imageAlt: {
      en: "An open notebook and a laptop on a desk, ready for a study session",
      es: "Un cuaderno abierto y un portátil sobre un escritorio, listos para estudiar",
    },
    authorId: "elena-rossi",
    date: "2026-09-22",
    readMinutes: 6,
    tags: [
      { en: "Learning", es: "Aprendizaje" },
      { en: "Productivity", es: "Productividad" },
    ],
    relatedCourse: "python-for-everyone",
  },
  {
    slug: "design-portfolio-that-gets-interviews",
    title: {
      en: "The design portfolio that gets interviews in 2026",
      es: "El portafolio de diseño que consigue entrevistas en 2026",
    },
    excerpt: {
      en: "Hiring managers spend about two minutes on your portfolio. Here's how to structure case studies so those minutes count.",
      es: "Los responsables de contratación dedican unos dos minutos a tu portafolio. Así puedes estructurar tus casos de estudio para que esos minutos cuenten.",
    },
    image: unsplash("1586717791821-3f44a563fa4c", 1600),
    imageAlt: {
      en: "Interface sketches and wireframes spread across a table",
      es: "Bocetos de interfaz y wireframes repartidos sobre una mesa",
    },
    authorId: "maya-chen",
    date: "2026-09-08",
    readMinutes: 7,
    tags: [
      { en: "Design", es: "Diseño" },
      { en: "Careers", es: "Carrera" },
    ],
    relatedCourse: "ui-design-foundations",
  },
  {
    slug: "why-sql-is-the-first-data-skill",
    title: {
      en: "Why SQL is still the first data skill to learn",
      es: "Por qué SQL sigue siendo la primera habilidad de datos que debes aprender",
    },
    excerpt: {
      en: "AI tools can write queries, but someone still has to ask the right question and check the answer. That someone needs SQL.",
      es: "Las herramientas de IA pueden escribir consultas, pero alguien tiene que hacer la pregunta correcta y comprobar la respuesta. Esa persona necesita SQL.",
    },
    image: unsplash("1504868584819-f8e8b4b6d7e3", 1600),
    imageAlt: {
      en: "Charts and dashboards on a laptop screen",
      es: "Gráficos y paneles en la pantalla de un portátil",
    },
    authorId: "priya-raman",
    date: "2026-08-25",
    readMinutes: 5,
    tags: [
      { en: "Data", es: "Datos" },
      { en: "Careers", es: "Carrera" },
    ],
    relatedCourse: "data-analysis-with-sql",
  },
  {
    slug: "spanish-phrases-for-meetings",
    title: {
      en: "10 Spanish phrases that make work meetings easier",
      es: "10 frases en español que facilitan las reuniones de trabajo",
    },
    excerpt: {
      en: "You don't need perfect grammar to contribute in a meeting. You need a handful of phrases you can use with confidence.",
      es: "No necesitas una gramática perfecta para participar en una reunión. Necesitas un puñado de frases que puedas usar con confianza.",
    },
    image: unsplash("1517048676732-d65bc937f952", 1600),
    imageAlt: {
      en: "Colleagues talking around a table during a meeting",
      es: "Compañeros conversando alrededor de una mesa durante una reunión",
    },
    authorId: "lucia-fernandez",
    date: "2026-08-11",
    readMinutes: 4,
    tags: [
      { en: "Languages", es: "Idiomas" },
      { en: "Workplace", es: "Trabajo" },
    ],
    relatedCourse: "business-spanish-for-professionals",
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
