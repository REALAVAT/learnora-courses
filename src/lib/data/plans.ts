import type { Plan } from "@/lib/types";

export const plans: Plan[] = [
  {
    id: "free",
    monthly: 0,
    yearly: 0,
    features: [
      { en: "All free courses", es: "Todos los cursos gratuitos" },
      { en: "Preview lessons of every course", es: "Lecciones de prueba de todos los cursos" },
      { en: "Notes and progress tracking", es: "Notas y seguimiento del progreso" },
      { en: "Community Q&A", es: "Preguntas y respuestas de la comunidad" },
    ],
  },
  {
    id: "pro",
    monthly: 19,
    yearly: 190,
    highlighted: true,
    features: [
      { en: "Unlimited access to 600+ courses", es: "Acceso ilimitado a más de 600 cursos" },
      { en: "Shareable certificates", es: "Certificados para compartir" },
      { en: "Quizzes and graded projects", es: "Cuestionarios y proyectos evaluados" },
      { en: "Offline viewing in the mobile app", es: "Ver sin conexión en la app móvil" },
      { en: "Priority instructor Q&A", es: "Preguntas prioritarias al instructor" },
    ],
  },
  {
    id: "business",
    monthly: 49,
    yearly: 490,
    features: [
      { en: "Everything in Pro", es: "Todo lo de Pro" },
      { en: "Team dashboard and reporting", es: "Panel y reportes de equipo" },
      { en: "Assign learning paths", es: "Asignar rutas de aprendizaje" },
      { en: "SSO and centralized billing", es: "SSO y facturación centralizada" },
      { en: "Dedicated success manager", es: "Gestor de éxito dedicado" },
    ],
  },
];

export function getPlan(id: string) {
  return plans.find((p) => p.id === id);
}
