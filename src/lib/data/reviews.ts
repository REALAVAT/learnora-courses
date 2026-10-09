import { unsplash } from "@/lib/images";
import type { Review } from "@/lib/types";

const pool: Omit<Review, "id">[] = [
  {
    name: "Sarah Mitchell",
    avatar: unsplash("1534528741775-53994a69daeb", 160),
    location: "Chicago, USA",
    rating: 5,
    date: "2026-09-02",
    body: {
      en: "Clear, practical and beautifully produced. I applied the first module at work the same week and my manager noticed.",
      es: "Claro, práctico y muy bien producido. Apliqué el primer módulo en el trabajo esa misma semana y mi jefa lo notó.",
    },
  },
  {
    name: "Mateo García",
    avatar: unsplash("1507003211169-0a1dd7228f2d", 160),
    location: "Bogotá, Colombia",
    rating: 5,
    date: "2026-08-21",
    body: {
      en: "The projects make the difference. I finally understand the why, not just the how.",
      es: "Los proyectos marcan la diferencia. Por fin entiendo el porqué, no solo el cómo.",
    },
  },
  {
    name: "Aisha Khan",
    avatar: unsplash("1508214751196-bcfd4ca60f91", 160),
    location: "Toronto, Canada",
    rating: 4,
    date: "2026-08-09",
    body: {
      en: "Great pacing and the notes feature is super handy. I'd love a few more advanced exercises at the end.",
      es: "Muy buen ritmo y la función de notas es muy útil. Me encantarían algunos ejercicios más avanzados al final.",
    },
  },
  {
    name: "Tom Becker",
    avatar: unsplash("1519085360753-af0119f7cbe7", 160),
    location: "Berlin, Germany",
    rating: 5,
    date: "2026-07-28",
    body: {
      en: "Best course I've taken online. The instructor explains complex ideas without dumbing them down.",
      es: "El mejor curso que he hecho online. El instructor explica ideas complejas sin simplificarlas en exceso.",
    },
  },
  {
    name: "Camila Torres",
    avatar: unsplash("1539571696357-5a69c17a67c6", 160),
    location: "Mexico City, Mexico",
    rating: 5,
    date: "2026-07-14",
    body: {
      en: "Having it available in Spanish helped my whole team join. The certificate was a nice bonus for LinkedIn.",
      es: "Tenerlo disponible en español ayudó a que todo mi equipo se uniera. El certificado fue un buen extra para LinkedIn.",
    },
  },
  {
    name: "James Lee",
    avatar: unsplash("1560250097-0b93528c311a", 160),
    location: "Seattle, USA",
    rating: 4,
    date: "2026-06-30",
    body: {
      en: "Solid content and well structured. Short lessons fit perfectly into my lunch breaks.",
      es: "Contenido sólido y bien estructurado. Las lecciones cortas encajan perfectamente en mi pausa para comer.",
    },
  },
  {
    name: "Priyanka Das",
    location: "Bangalore, India",
    rating: 5,
    date: "2026-06-11",
    body: {
      en: "I switched careers partly thanks to this course. The portfolio project got me two interviews.",
      es: "Cambié de carrera en parte gracias a este curso. El proyecto de portafolio me consiguió dos entrevistas.",
    },
  },
  {
    name: "Lucas Moreau",
    location: "Lyon, France",
    rating: 5,
    date: "2026-05-25",
    body: {
      en: "Thoughtful, honest teaching. No filler, just useful lessons and great examples.",
      es: "Una enseñanza cuidada y honesta. Sin relleno, solo lecciones útiles y buenos ejemplos.",
    },
  },
];

export function getReviews(slug: string, count = 4): Review[] {
  let seed = [...slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const picked: Review[] = [];
  const used = new Set<number>();
  while (picked.length < Math.min(count, pool.length)) {
    seed = (seed * 9301 + 49297) % 233280;
    const index = seed % pool.length;
    if (used.has(index)) continue;
    used.add(index);
    picked.push({ ...pool[index], id: `${slug}-r${index}` });
  }
  return picked;
}

export function ratingBreakdown(rating: number) {
  const five = Math.round(Math.min(92, Math.max(40, (rating - 4) * 100 + 10)));
  const four = Math.round((100 - five) * 0.65);
  const three = Math.round((100 - five - four) * 0.6);
  const two = Math.round((100 - five - four - three) * 0.6);
  const one = Math.max(0, 100 - five - four - three - two);
  return [five, four, three, two, one];
}
