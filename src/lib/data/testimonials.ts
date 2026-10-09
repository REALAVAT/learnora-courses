import { unsplash } from "@/lib/images";
import type { Localized } from "@/lib/types";

export type Testimonial = {
  name: string;
  role: Localized;
  avatar: string;
  quote: Localized;
};

export const testimonials: Testimonial[] = [
  {
    name: "Olivia Bennett",
    role: { en: "Product Designer, Brooklyn", es: "Diseñadora de producto, Brooklyn" },
    avatar: unsplash("1494790108377-be9c29b29330", 200),
    quote: {
      en: "I went from marketing coordinator to product designer in eight months. Learnora's projects gave me a portfolio I was proud to show.",
      es: "Pasé de coordinadora de marketing a diseñadora de producto en ocho meses. Los proyectos de Learnora me dieron un portafolio del que me sentía orgullosa.",
    },
  },
  {
    name: "Diego Ramírez",
    role: { en: "Frontend Engineer, Buenos Aires", es: "Ingeniero frontend, Buenos Aires" },
    avatar: unsplash("1507003211169-0a1dd7228f2d", 200),
    quote: {
      en: "The React course is the clearest explanation of Server Components I've seen. Our whole team now uses it for onboarding.",
      es: "El curso de React es la explicación más clara de los Server Components que he visto. Todo mi equipo lo usa ahora para la incorporación.",
    },
  },
  {
    name: "Hannah Schultz",
    role: { en: "Operations Lead, Denver", es: "Responsable de operaciones, Denver" },
    avatar: unsplash("1534528741775-53994a69daeb", 200),
    quote: {
      en: "Short lessons, real examples and a player that remembers exactly where I left off. It fits a busy schedule.",
      es: "Lecciones cortas, ejemplos reales y un reproductor que recuerda exactamente dónde lo dejé. Encaja en una agenda apretada.",
    },
  },
];
