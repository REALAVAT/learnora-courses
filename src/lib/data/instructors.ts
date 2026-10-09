import { unsplash } from "@/lib/images";
import type { Instructor } from "@/lib/types";

export const instructors: Instructor[] = [
  {
    slug: "maya-chen",
    name: "Maya Chen",
    role: { en: "Principal Product Designer", es: "Diseñadora de producto principal" },
    bio: {
      en: "Maya has spent twelve years designing products used by millions, most recently leading design systems at a fintech in Manhattan. She teaches the craft the way she practices it: start with the problem, sketch fast, then sweat the details.",
      es: "Maya lleva doce años diseñando productos que usan millones de personas; su último puesto fue liderar sistemas de diseño en una fintech de Manhattan. Enseña el oficio como lo practica: empieza por el problema, boceta rápido y cuida cada detalle.",
    },
    avatar: unsplash("1580489944761-15a19d654956", 400),
    location: "New York, USA",
    expertise: ["design"],
    yearsExperience: 12,
    rating: 4.9,
    links: [
      { label: "Website", href: "https://example.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com" },
    ],
  },
  {
    slug: "daniel-okafor",
    name: "Daniel Okafor",
    role: { en: "Staff Software Engineer", es: "Ingeniero de software staff" },
    bio: {
      en: "Daniel builds web platforms at scale and has shipped React in production since 2015. He loves turning intimidating topics into small, testable steps, and his code reviews are famously kind.",
      es: "Daniel construye plataformas web a gran escala y usa React en producción desde 2015. Le encanta convertir temas intimidantes en pasos pequeños y comprobables, y sus revisiones de código son famosas por su amabilidad.",
    },
    avatar: unsplash("1506794778202-cad84cf45f1d", 400),
    location: "Toronto, Canada",
    expertise: ["development"],
    yearsExperience: 11,
    rating: 4.8,
    links: [
      { label: "GitHub", href: "https://github.com" },
      { label: "Website", href: "https://example.com" },
    ],
  },
  {
    slug: "priya-raman",
    name: "Priya Raman",
    role: { en: "Lead Data Scientist", es: "Científica de datos principal" },
    bio: {
      en: "Priya leads a data team in Austin and has taught thousands of analysts to love SQL. Her courses focus on real questions from real companies, never toy datasets.",
      es: "Priya dirige un equipo de datos en Austin y ha enseñado a miles de analistas a disfrutar de SQL. Sus cursos se centran en preguntas reales de empresas reales, nunca en datos de juguete.",
    },
    avatar: unsplash("1573496359142-b8d87734a5a2", 400),
    location: "Austin, USA",
    expertise: ["data", "development"],
    yearsExperience: 9,
    rating: 4.9,
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com" }],
  },
  {
    slug: "james-whitaker",
    name: "James Whitaker",
    role: { en: "VP of Product", es: "Vicepresidente de producto" },
    bio: {
      en: "James has led product teams at three venture-backed startups, two of which were acquired. He teaches the unglamorous habits that make great product managers: clear writing, crisp priorities and honest metrics.",
      es: "James ha dirigido equipos de producto en tres startups con capital de riesgo, dos de ellas adquiridas. Enseña los hábitos poco glamurosos que hacen a un gran product manager: escritura clara, prioridades nítidas y métricas honestas.",
    },
    avatar: unsplash("1472099645785-5658abf4ff4e", 400),
    location: "San Francisco, USA",
    expertise: ["business"],
    yearsExperience: 15,
    rating: 4.7,
    links: [{ label: "Newsletter", href: "https://example.com" }],
  },
  {
    slug: "amara-nwosu",
    name: "Amara Nwosu",
    role: { en: "Growth & Finance Advisor", es: "Asesora de crecimiento y finanzas" },
    bio: {
      en: "Amara advises early-stage founders on fundraising and growth. Before that she ran marketing at a Brooklyn consumer brand from seed to Series B.",
      es: "Amara asesora a fundadores en etapas iniciales sobre financiación y crecimiento. Antes dirigió marketing en una marca de consumo de Brooklyn desde la ronda semilla hasta la Serie B.",
    },
    avatar: unsplash("1531123897727-8f129e1688ce", 400),
    location: "London, UK",
    expertise: ["business"],
    yearsExperience: 10,
    rating: 4.8,
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com" }],
  },
  {
    slug: "lucia-fernandez",
    name: "Lucía Fernández",
    role: { en: "Applied Linguist & Language Coach", es: "Lingüista aplicada y coach de idiomas" },
    bio: {
      en: "Lucía coaches executives across the Americas and Europe in business Spanish and English. Her method is simple: speak from day one, learn the phrases you actually need, and practice in realistic situations.",
      es: "Lucía entrena a directivos de América y Europa en español e inglés para negocios. Su método es sencillo: hablar desde el primer día, aprender las frases que realmente necesitas y practicar en situaciones reales.",
    },
    avatar: unsplash("1438761681033-6461ffad8d80", 400),
    location: "Madrid, Spain",
    expertise: ["languages"],
    yearsExperience: 14,
    rating: 4.9,
    links: [{ label: "Website", href: "https://example.com" }],
  },
  {
    slug: "kenji-sato",
    name: "Kenji Sato",
    role: { en: "Editorial Photographer", es: "Fotógrafo editorial" },
    bio: {
      en: "Kenji shoots portraits and travel stories for magazines from his studio in Brooklyn. He believes great photos come from seeing light, not from buying gear.",
      es: "Kenji fotografía retratos e historias de viaje para revistas desde su estudio en Brooklyn. Cree que las grandes fotos nacen de ver la luz, no de comprar equipo.",
    },
    avatar: unsplash("1500648767791-00dcc994a43e", 400),
    location: "Brooklyn, USA",
    expertise: ["photography"],
    yearsExperience: 13,
    rating: 4.9,
    links: [{ label: "Portfolio", href: "https://example.com" }],
  },
  {
    slug: "elena-rossi",
    name: "Elena Rossi",
    role: { en: "UX Research Director", es: "Directora de investigación UX" },
    bio: {
      en: "Elena has run research programs for global retail and healthcare products. She teaches lean, rigorous research that product teams actually use.",
      es: "Elena ha dirigido programas de investigación para productos globales de retail y salud. Enseña investigación ágil y rigurosa que los equipos de producto realmente usan.",
    },
    avatar: unsplash("1544005313-94ddf0286df2", 400),
    location: "Milan, Italy",
    expertise: ["design", "data"],
    yearsExperience: 11,
    rating: 4.8,
    links: [{ label: "LinkedIn", href: "https://www.linkedin.com" }],
  },
];

export function getInstructor(slug: string) {
  return instructors.find((i) => i.slug === slug);
}
