import { unsplash } from "@/lib/images";
import type { CategoryId, Course, CourseLanguage, Level, Localized, Module } from "@/lib/types";
import { quizBanks } from "./quizzes";

type L = [en: string, es: string];
type LessonDef = [en: string, es: string, minutes: number, kind?: "article"];
type ModuleDef = [title: L, lessons: LessonDef[]];

type CourseDef = {
  slug: string;
  title: L;
  subtitle: L;
  description: L;
  category: CategoryId;
  level: Level;
  language?: CourseLanguage;
  price: number;
  originalPrice?: number;
  rating: number;
  ratingCount: number;
  students: number;
  instructorId: string;
  image: string;
  updated: string;
  outcomes: L[];
  requirements: L[];
  modules: ModuleDef[];
  bestseller?: boolean;
  isNew?: boolean;
  featured?: boolean;
};

const loc = ([en, es]: L): Localized => ({ en, es });

function buildModules(defs: ModuleDef[]): Module[] {
  return defs.map(([title, lessons], m) => ({
    id: `m${m + 1}`,
    title: loc(title),
    lessons: lessons.map(([en, es, duration, kind], l) => ({
      id: `m${m + 1}-l${l + 1}`,
      title: { en, es },
      duration,
      type: kind === "article" ? "article" : "video",
      preview: m === 0 && l < 2,
    })),
  }));
}

function course(def: CourseDef): Course {
  return {
    ...def,
    language: def.language ?? "en",
    title: loc(def.title),
    subtitle: loc(def.subtitle),
    description: loc(def.description),
    outcomes: def.outcomes.map(loc),
    requirements: def.requirements.map(loc),
    modules: buildModules(def.modules),
    quiz: {
      id: "final",
      title: { en: "Final assessment", es: "Evaluación final" },
      passScore: 70,
      questions: quizBanks[def.category],
    },
  };
}

export const courses: Course[] = [
  course({
    slug: "ui-design-foundations",
    title: ["UI Design Foundations", "Fundamentos de diseño UI"],
    subtitle: [
      "Go from blank canvas to polished, accessible interfaces in Figma.",
      "Pasa del lienzo en blanco a interfaces pulidas y accesibles en Figma.",
    ],
    description: [
      "A hands-on introduction to interface design. You'll learn layout, type, color and components by redesigning a real banking app screen by screen, then present your case study like a pro.",
      "Una introducción práctica al diseño de interfaces. Aprenderás maquetación, tipografía, color y componentes rediseñando pantalla a pantalla una app bancaria real, y presentarás tu caso de estudio como un profesional.",
    ],
    category: "design",
    level: "beginner",
    price: 79,
    originalPrice: 129,
    rating: 4.9,
    ratingCount: 3184,
    students: 28410,
    instructorId: "maya-chen",
    image: unsplash("1561070791-2526d30994b5"),
    updated: "2026-08-14",
    bestseller: true,
    featured: true,
    outcomes: [
      ["Build clean layouts with grids and a spacing scale", "Crear diseños limpios con retículas y escala de espaciado"],
      ["Pair typefaces and set a readable type scale", "Combinar tipografías y definir una escala legible"],
      ["Choose accessible color palettes that pass WCAG", "Elegir paletas de color accesibles que cumplan WCAG"],
      ["Present a portfolio-ready case study", "Presentar un caso de estudio listo para tu portafolio"],
    ],
    requirements: [
      ["A free Figma account", "Una cuenta gratuita de Figma"],
      ["No prior design experience needed", "No necesitas experiencia previa en diseño"],
    ],
    modules: [
      [
        ["Seeing like a designer", "Ver como un diseñador"],
        [
          ["Welcome and course roadmap", "Bienvenida y hoja de ruta del curso", 4],
          ["Anatomy of a great interface", "Anatomía de una gran interfaz", 11],
          ["Visual hierarchy in practice", "Jerarquía visual en la práctica", 14],
        ],
      ],
      [
        ["Layout, type and color", "Maquetación, tipografía y color"],
        [
          ["Grids and the 8-point system", "Retículas y el sistema de 8 puntos", 16],
          ["Building a type scale", "Construir una escala tipográfica", 13],
          ["Accessible color palettes", "Paletas de color accesibles", 15],
          ["Cheat sheet: contrast and spacing", "Chuleta: contraste y espaciado", 6, "article"],
        ],
      ],
      [
        ["Components and the case study", "Componentes y caso de estudio"],
        [
          ["Reusable components and variants", "Componentes reutilizables y variantes", 18],
          ["Redesigning the dashboard", "Rediseñar el panel principal", 22],
          ["Presenting your case study", "Presentar tu caso de estudio", 12],
        ],
      ],
    ],
  }),
  course({
    slug: "figma-design-systems",
    title: ["Design Systems in Figma", "Sistemas de diseño en Figma"],
    subtitle: [
      "Tokens, variables and components that scale across teams.",
      "Tokens, variables y componentes que escalan entre equipos.",
    ],
    description: [
      "Learn to build a production-grade design system: tokens, variables, auto layout, documentation and handoff. Includes a complete starter kit you can adapt for clients.",
      "Aprende a construir un sistema de diseño profesional: tokens, variables, auto layout, documentación y entrega a desarrollo. Incluye un kit inicial completo que puedes adaptar para clientes.",
    ],
    category: "design",
    level: "intermediate",
    price: 99,
    rating: 4.8,
    ratingCount: 1420,
    students: 11230,
    instructorId: "maya-chen",
    image: unsplash("1581291518857-4e27b48ff24e"),
    updated: "2026-07-02",
    outcomes: [
      ["Model color, type and spacing as variables", "Modelar color, tipografía y espaciado como variables"],
      ["Build flexible components with auto layout", "Crear componentes flexibles con auto layout"],
      ["Support light and dark themes from one source", "Soportar temas claro y oscuro desde una sola fuente"],
      ["Document and hand off to developers", "Documentar y entregar a desarrollo"],
    ],
    requirements: [
      ["Comfortable with Figma basics", "Manejo básico de Figma"],
      ["Some UI design experience", "Algo de experiencia en diseño UI"],
    ],
    modules: [
      [
        ["Foundations", "Fundamentos"],
        [
          ["Why design systems fail", "Por qué fracasan los sistemas de diseño", 9],
          ["Tokens and variables", "Tokens y variables", 17],
          ["Theming with modes", "Temas con modos", 14],
        ],
      ],
      [
        ["Components", "Componentes"],
        [
          ["Auto layout deep dive", "Auto layout a fondo", 19],
          ["Variants and properties", "Variantes y propiedades", 16],
          ["Building the button family", "Construir la familia de botones", 21],
        ],
      ],
      [
        ["Scaling the system", "Escalar el sistema"],
        [
          ["Documentation that people read", "Documentación que la gente lee", 12],
          ["Developer handoff", "Entrega a desarrollo", 13],
          ["Governance checklist", "Lista de gobernanza", 5, "article"],
        ],
      ],
    ],
  }),
  course({
    slug: "ux-research-that-ships",
    title: ["UX Research That Ships", "Investigación UX que llega a producción"],
    subtitle: [
      "Plan, run and synthesize research your team will act on.",
      "Planifica, realiza y sintetiza investigación que tu equipo usará.",
    ],
    description: [
      "Practical methods for interviews, usability tests and surveys, plus the synthesis and storytelling skills that turn findings into decisions.",
      "Métodos prácticos para entrevistas, tests de usabilidad y encuestas, junto con las habilidades de síntesis y narrativa que convierten hallazgos en decisiones.",
    ],
    category: "design",
    level: "intermediate",
    price: 89,
    rating: 4.7,
    ratingCount: 864,
    students: 6420,
    instructorId: "elena-rossi",
    image: unsplash("1531403009284-440f080d1e12"),
    updated: "2026-05-21",
    outcomes: [
      ["Write a lean research plan", "Escribir un plan de investigación ágil"],
      ["Run unbiased user interviews", "Realizar entrevistas sin sesgos"],
      ["Synthesize findings with affinity mapping", "Sintetizar hallazgos con mapas de afinidad"],
      ["Present insights that drive roadmap changes", "Presentar hallazgos que cambian la hoja de ruta"],
    ],
    requirements: [
      ["Curiosity about people", "Curiosidad por las personas"],
      ["No tools required", "No se necesitan herramientas"],
    ],
    modules: [
      [
        ["Planning research", "Planificar la investigación"],
        [
          ["Choosing the right method", "Elegir el método adecuado", 10],
          ["Recruiting participants", "Reclutar participantes", 12],
          ["Research plan template", "Plantilla de plan de investigación", 5, "article"],
        ],
      ],
      [
        ["Running sessions", "Realizar sesiones"],
        [
          ["Interview techniques", "Técnicas de entrevista", 18],
          ["Moderated usability tests", "Tests de usabilidad moderados", 16],
          ["Surveys that don't lie", "Encuestas que no mienten", 13],
        ],
      ],
      [
        ["From findings to decisions", "De hallazgos a decisiones"],
        [
          ["Affinity mapping", "Mapas de afinidad", 14],
          ["Storytelling with evidence", "Narrar con evidencias", 12],
        ],
      ],
    ],
  }),
  course({
    slug: "modern-react-nextjs",
    title: ["Modern React & Next.js", "React y Next.js modernos"],
    subtitle: [
      "Build fast, full-stack web apps with Server Components and the App Router.",
      "Crea aplicaciones web full-stack rápidas con Server Components y App Router.",
    ],
    description: [
      "The course Daniel wishes he had: a clear mental model of React, then a complete Next.js app with routing, data fetching, forms, auth patterns, caching and deployment.",
      "El curso que Daniel habría querido tener: un modelo mental claro de React y, después, una app completa en Next.js con rutas, carga de datos, formularios, autenticación, caché y despliegue.",
    ],
    category: "development",
    level: "intermediate",
    price: 129,
    originalPrice: 189,
    rating: 4.9,
    ratingCount: 5210,
    students: 41890,
    instructorId: "daniel-okafor",
    image: unsplash("1555066931-4365d14bab8c"),
    updated: "2026-09-03",
    bestseller: true,
    featured: true,
    outcomes: [
      ["Think in components, state and effects", "Pensar en componentes, estado y efectos"],
      ["Use Server and Client Components correctly", "Usar correctamente Server y Client Components"],
      ["Handle forms and validation end to end", "Gestionar formularios y validación de principio a fin"],
      ["Deploy a production app to Vercel", "Desplegar una app en producción en Vercel"],
    ],
    requirements: [
      ["Solid JavaScript fundamentals", "Fundamentos sólidos de JavaScript"],
      ["Basic HTML and CSS", "HTML y CSS básicos"],
    ],
    modules: [
      [
        ["React mental model", "El modelo mental de React"],
        [
          ["What React actually does", "Qué hace realmente React", 9],
          ["State, props and rendering", "Estado, props y renderizado", 17],
          ["Effects without the footguns", "Efectos sin trampas", 15],
        ],
      ],
      [
        ["The App Router", "El App Router"],
        [
          ["Layouts, pages and routing", "Layouts, páginas y rutas", 16],
          ["Server Components and data", "Server Components y datos", 21],
          ["Loading and error states", "Estados de carga y error", 11],
          ["Caching cheat sheet", "Chuleta de caché", 6, "article"],
        ],
      ],
      [
        ["Shipping the app", "Publicar la app"],
        [
          ["Forms with server actions", "Formularios con server actions", 19],
          ["Auth patterns", "Patrones de autenticación", 17],
          ["Deploying to Vercel", "Desplegar en Vercel", 10],
        ],
      ],
    ],
  }),
  course({
    slug: "typescript-for-professionals",
    title: ["TypeScript for Professionals", "TypeScript para profesionales"],
    subtitle: [
      "Generics, narrowing and type-safe APIs without the confusion.",
      "Genéricos, narrowing y APIs con tipos seguros sin confusión.",
    ],
    description: [
      "Move beyond 'any'. Learn the type system patterns that power real codebases, from discriminated unions to advanced generics and runtime validation with zod.",
      "Ve más allá de 'any'. Aprende los patrones del sistema de tipos que impulsan bases de código reales, desde uniones discriminadas hasta genéricos avanzados y validación con zod.",
    ],
    category: "development",
    level: "advanced",
    price: 99,
    rating: 4.8,
    ratingCount: 2105,
    students: 15320,
    instructorId: "daniel-okafor",
    image: unsplash("1515879218367-8466d910aaa4"),
    updated: "2026-06-18",
    outcomes: [
      ["Model domains with unions and literal types", "Modelar dominios con uniones y tipos literales"],
      ["Write reusable generic utilities", "Escribir utilidades genéricas reutilizables"],
      ["Validate untrusted data at runtime", "Validar datos no confiables en tiempo de ejecución"],
      ["Migrate a JavaScript codebase safely", "Migrar una base de código JavaScript con seguridad"],
    ],
    requirements: [
      ["Comfortable with JavaScript", "Soltura con JavaScript"],
      ["Basic TypeScript syntax", "Sintaxis básica de TypeScript"],
    ],
    modules: [
      [
        ["Types that model reality", "Tipos que modelan la realidad"],
        [
          ["Structural typing explained", "El tipado estructural explicado", 12],
          ["Unions and narrowing", "Uniones y narrowing", 18],
          ["Discriminated unions", "Uniones discriminadas", 15],
        ],
      ],
      [
        ["Generics", "Genéricos"],
        [
          ["Generic functions", "Funciones genéricas", 16],
          ["Mapped and conditional types", "Tipos mapeados y condicionales", 22],
          ["Utility types reference", "Referencia de tipos utilitarios", 7, "article"],
        ],
      ],
      [
        ["Real-world TypeScript", "TypeScript en el mundo real"],
        [
          ["Runtime validation with zod", "Validación con zod", 14],
          ["Migrating a codebase", "Migrar una base de código", 17],
        ],
      ],
    ],
  }),
  course({
    slug: "python-for-everyone",
    title: ["Python for Everyone", "Python para todos"],
    subtitle: [
      "Your first programming language, taught with real everyday projects.",
      "Tu primer lenguaje de programación, con proyectos reales del día a día.",
    ],
    description: [
      "A friendly, free introduction to programming. Automate boring tasks, work with files and data, and build three small projects you'll actually use.",
      "Una introducción gratuita y amable a la programación. Automatiza tareas aburridas, trabaja con archivos y datos, y crea tres pequeños proyectos que de verdad usarás.",
    ],
    category: "development",
    level: "beginner",
    price: 0,
    rating: 4.7,
    ratingCount: 9840,
    students: 86210,
    instructorId: "priya-raman",
    image: unsplash("1517694712202-14dd9538aa97"),
    updated: "2026-04-09",
    outcomes: [
      ["Write and run Python programs", "Escribir y ejecutar programas en Python"],
      ["Use lists, dicts and loops confidently", "Usar listas, diccionarios y bucles con confianza"],
      ["Read and write CSV files", "Leer y escribir archivos CSV"],
      ["Automate a repetitive task", "Automatizar una tarea repetitiva"],
    ],
    requirements: [
      ["A computer with internet access", "Un ordenador con conexión a internet"],
      ["No experience needed", "No necesitas experiencia"],
    ],
    modules: [
      [
        ["Getting started", "Primeros pasos"],
        [
          ["Installing Python", "Instalar Python", 7],
          ["Variables and types", "Variables y tipos", 12],
          ["Your first script", "Tu primer script", 10],
        ],
      ],
      [
        ["Core skills", "Habilidades clave"],
        [
          ["Lists and loops", "Listas y bucles", 15],
          ["Dictionaries", "Diccionarios", 13],
          ["Functions", "Funciones", 14],
        ],
      ],
      [
        ["Projects", "Proyectos"],
        [
          ["Expense tracker", "Control de gastos", 18],
          ["File organizer", "Organizador de archivos", 16],
          ["Where to go next", "Siguientes pasos", 4, "article"],
        ],
      ],
    ],
  }),
  course({
    slug: "data-analysis-with-sql",
    title: ["Data Analysis with SQL", "Análisis de datos con SQL"],
    subtitle: [
      "Answer real business questions with queries, joins and window functions.",
      "Responde preguntas de negocio reales con consultas, joins y funciones de ventana.",
    ],
    description: [
      "Work through a realistic e-commerce database and learn the SQL analysts use every day, from SELECT to cohort analysis.",
      "Trabaja con una base de datos de comercio electrónico realista y aprende el SQL que los analistas usan a diario, desde SELECT hasta análisis de cohortes.",
    ],
    category: "data",
    level: "beginner",
    price: 69,
    originalPrice: 99,
    rating: 4.8,
    ratingCount: 4120,
    students: 32540,
    instructorId: "priya-raman",
    image: unsplash("1551288049-bebda4e38f71"),
    updated: "2026-08-27",
    bestseller: true,
    outcomes: [
      ["Write SELECT queries with filters and sorting", "Escribir consultas SELECT con filtros y orden"],
      ["Combine tables with joins", "Combinar tablas con joins"],
      ["Aggregate and group data", "Agregar y agrupar datos"],
      ["Run cohort and retention analysis", "Hacer análisis de cohortes y retención"],
    ],
    requirements: [
      ["Comfortable with spreadsheets", "Soltura con hojas de cálculo"],
      ["No coding required", "No se requiere programar"],
    ],
    modules: [
      [
        ["Querying basics", "Consultas básicas"],
        [
          ["Your first SELECT", "Tu primer SELECT", 9],
          ["Filtering and sorting", "Filtrar y ordenar", 13],
          ["Working with NULLs", "Trabajar con NULL", 10],
        ],
      ],
      [
        ["Combining data", "Combinar datos"],
        [
          ["Inner and left joins", "Inner y left joins", 17],
          ["GROUP BY and HAVING", "GROUP BY y HAVING", 15],
          ["SQL style guide", "Guía de estilo SQL", 5, "article"],
        ],
      ],
      [
        ["Analytics patterns", "Patrones de analítica"],
        [
          ["Window functions", "Funciones de ventana", 19],
          ["Cohort retention", "Retención por cohortes", 18],
        ],
      ],
    ],
  }),
  course({
    slug: "practical-ai-for-professionals",
    title: ["Practical AI for Professionals", "IA práctica para profesionales"],
    subtitle: [
      "Use AI assistants to research, write and analyze faster, responsibly.",
      "Usa asistentes de IA para investigar, escribir y analizar más rápido, con responsabilidad.",
    ],
    description: [
      "A no-hype, hands-on guide to AI at work. Learn prompting patterns, build repeatable workflows and understand the limits so you can use AI with confidence.",
      "Una guía práctica y sin exageraciones sobre la IA en el trabajo. Aprende patrones de instrucciones, crea flujos repetibles y entiende los límites para usar la IA con confianza.",
    ],
    category: "data",
    level: "all",
    price: 89,
    rating: 4.8,
    ratingCount: 1290,
    students: 9870,
    instructorId: "priya-raman",
    image: unsplash("1677442136019-21780ecad995"),
    updated: "2026-09-22",
    isNew: true,
    featured: true,
    outcomes: [
      ["Write clear, structured prompts", "Escribir instrucciones claras y estructuradas"],
      ["Summarize and analyze documents", "Resumir y analizar documentos"],
      ["Build repeatable AI workflows", "Crear flujos de trabajo repetibles con IA"],
      ["Spot hallucinations and privacy risks", "Detectar alucinaciones y riesgos de privacidad"],
    ],
    requirements: [
      ["Access to any AI assistant", "Acceso a cualquier asistente de IA"],
      ["No technical background needed", "No necesitas conocimientos técnicos"],
    ],
    modules: [
      [
        ["How AI assistants work", "Cómo funcionan los asistentes de IA"],
        [
          ["A plain-English model of LLMs", "Un modelo sencillo de los LLM", 10],
          ["Strengths and limits", "Fortalezas y límites", 11],
          ["Prompt patterns", "Patrones de instrucciones", 16],
        ],
      ],
      [
        ["AI at work", "IA en el trabajo"],
        [
          ["Research and summarizing", "Investigar y resumir", 14],
          ["Writing and editing", "Escribir y editar", 13],
          ["Analyzing spreadsheets", "Analizar hojas de cálculo", 15],
        ],
      ],
      [
        ["Workflows and responsibility", "Flujos y responsabilidad"],
        [
          ["Building reusable workflows", "Crear flujos reutilizables", 17],
          ["Privacy and verification checklist", "Lista de privacidad y verificación", 6, "article"],
        ],
      ],
    ],
  }),
  course({
    slug: "product-management-essentials",
    title: ["Product Management Essentials", "Fundamentos de product management"],
    subtitle: [
      "Discovery, prioritization and roadmaps from a VP who has done it.",
      "Descubrimiento, priorización y hojas de ruta de la mano de un VP con experiencia.",
    ],
    description: [
      "Everything a new PM needs in the first 90 days: understanding customers, writing specs, prioritizing ruthlessly and working with engineering and design.",
      "Todo lo que un nuevo PM necesita en sus primeros 90 días: entender a los clientes, escribir especificaciones, priorizar sin piedad y colaborar con ingeniería y diseño.",
    ],
    category: "business",
    level: "beginner",
    price: 99,
    originalPrice: 149,
    rating: 4.7,
    ratingCount: 2760,
    students: 19650,
    instructorId: "james-whitaker",
    image: unsplash("1552664730-d307ca884978"),
    updated: "2026-07-30",
    featured: true,
    outcomes: [
      ["Run customer discovery interviews", "Hacer entrevistas de descubrimiento"],
      ["Prioritize with RICE and opportunity sizing", "Priorizar con RICE y dimensionar oportunidades"],
      ["Write clear one-page specs", "Escribir especificaciones claras de una página"],
      ["Build an outcome-based roadmap", "Crear una hoja de ruta basada en resultados"],
    ],
    requirements: [
      ["Interest in building products", "Interés por crear productos"],
      ["No prior PM experience needed", "No necesitas experiencia previa como PM"],
    ],
    modules: [
      [
        ["The PM role", "El rol de PM"],
        [
          ["What PMs actually do", "Qué hace realmente un PM", 9],
          ["Your first 90 days", "Tus primeros 90 días", 12],
          ["Working with engineers", "Trabajar con ingeniería", 13],
        ],
      ],
      [
        ["Discovery and prioritization", "Descubrimiento y priorización"],
        [
          ["Customer interviews", "Entrevistas con clientes", 16],
          ["Prioritization frameworks", "Marcos de priorización", 15],
          ["One-page spec template", "Plantilla de especificación", 5, "article"],
        ],
      ],
      [
        ["Roadmaps and metrics", "Hojas de ruta y métricas"],
        [
          ["Outcome-based roadmaps", "Hojas de ruta por resultados", 14],
          ["Metrics that matter", "Métricas que importan", 13],
        ],
      ],
    ],
  }),
  course({
    slug: "startup-finance-and-fundraising",
    title: ["Startup Finance & Fundraising", "Finanzas y financiación para startups"],
    subtitle: [
      "Models, metrics and pitch decks investors take seriously.",
      "Modelos, métricas y presentaciones que los inversores toman en serio.",
    ],
    description: [
      "Build a three-statement startup model, understand unit economics and prepare a fundraising process from first meeting to term sheet.",
      "Construye un modelo financiero de tres estados, entiende la economía unitaria y prepara un proceso de financiación desde la primera reunión hasta la term sheet.",
    ],
    category: "business",
    level: "intermediate",
    price: 109,
    rating: 4.8,
    ratingCount: 980,
    students: 7340,
    instructorId: "amara-nwosu",
    image: unsplash("1460925895917-afdab827c52f"),
    updated: "2026-06-04",
    outcomes: [
      ["Build a simple financial model", "Construir un modelo financiero sencillo"],
      ["Calculate CAC, LTV, burn and runway", "Calcular CAC, LTV, gasto y runway"],
      ["Craft a compelling pitch deck", "Crear una presentación convincente"],
      ["Negotiate key term sheet points", "Negociar los puntos clave de una term sheet"],
    ],
    requirements: [
      ["Basic spreadsheet skills", "Manejo básico de hojas de cálculo"],
      ["An idea or early-stage company helps", "Ayuda tener una idea o empresa en fase inicial"],
    ],
    modules: [
      [
        ["Startup metrics", "Métricas de startups"],
        [
          ["Unit economics", "Economía unitaria", 14],
          ["Burn and runway", "Gasto y runway", 11],
          ["Metrics glossary", "Glosario de métricas", 5, "article"],
        ],
      ],
      [
        ["Modeling", "Modelado"],
        [
          ["Revenue model", "Modelo de ingresos", 17],
          ["Hiring plan and costs", "Plan de contratación y costes", 13],
        ],
      ],
      [
        ["Raising money", "Captar capital"],
        [
          ["The pitch deck", "La presentación para inversores", 16],
          ["Running a fundraise", "Gestionar una ronda", 14],
          ["Term sheets decoded", "La term sheet descifrada", 15],
        ],
      ],
    ],
  }),
  course({
    slug: "growth-marketing-playbook",
    title: ["Growth Marketing Playbook", "Manual de growth marketing"],
    subtitle: [
      "Experiments, funnels and channels that compound.",
      "Experimentos, embudos y canales que crecen de forma compuesta.",
    ],
    description: [
      "A practical system for finding and scaling growth: funnel analytics, experiment design, lifecycle email, SEO and paid acquisition basics.",
      "Un sistema práctico para encontrar y escalar el crecimiento: analítica de embudos, diseño de experimentos, email de ciclo de vida, SEO y fundamentos de adquisición de pago.",
    ],
    category: "business",
    level: "intermediate",
    price: 89,
    rating: 4.6,
    ratingCount: 1530,
    students: 12080,
    instructorId: "amara-nwosu",
    image: unsplash("1557862921-37829c790f19"),
    updated: "2026-05-12",
    outcomes: [
      ["Map and measure your funnel", "Mapear y medir tu embudo"],
      ["Design statistically sound experiments", "Diseñar experimentos estadísticamente sólidos"],
      ["Build lifecycle email flows", "Crear flujos de email de ciclo de vida"],
      ["Choose the right acquisition channels", "Elegir los canales de adquisición adecuados"],
    ],
    requirements: [
      ["Basic marketing knowledge", "Conocimientos básicos de marketing"],
      ["Access to any analytics tool helps", "Ayuda tener acceso a una herramienta de analítica"],
    ],
    modules: [
      [
        ["Growth foundations", "Fundamentos de crecimiento"],
        [
          ["Growth loops vs funnels", "Bucles de crecimiento frente a embudos", 12],
          ["Finding your north star", "Encontrar tu métrica estrella", 10],
        ],
      ],
      [
        ["Experimentation", "Experimentación"],
        [
          ["Writing hypotheses", "Escribir hipótesis", 11],
          ["A/B testing done right", "Tests A/B bien hechos", 17],
          ["Experiment log template", "Plantilla de registro de experimentos", 4, "article"],
        ],
      ],
      [
        ["Channels", "Canales"],
        [
          ["Lifecycle email", "Email de ciclo de vida", 15],
          ["SEO for startups", "SEO para startups", 16],
          ["Paid acquisition basics", "Fundamentos de adquisición de pago", 14],
        ],
      ],
    ],
  }),
  course({
    slug: "business-spanish-for-professionals",
    title: ["Business Spanish for Professionals", "Español de negocios para profesionales"],
    subtitle: [
      "Meetings, emails and small talk in Spanish from day one.",
      "Reuniones, correos y conversación informal en español desde el primer día.",
    ],
    description: [
      "Designed for busy professionals working with Spanish-speaking teams and clients. Short lessons, real dialogues and phrases you can use tomorrow.",
      "Pensado para profesionales ocupados que trabajan con equipos y clientes hispanohablantes. Lecciones cortas, diálogos reales y frases que podrás usar mañana.",
    ],
    category: "languages",
    level: "beginner",
    language: "es",
    price: 59,
    rating: 4.9,
    ratingCount: 2210,
    students: 17460,
    instructorId: "lucia-fernandez",
    image: unsplash("1543269865-cbf427effbad"),
    updated: "2026-08-05",
    bestseller: true,
    outcomes: [
      ["Introduce yourself and your company", "Presentarte a ti y a tu empresa"],
      ["Run and follow a meeting in Spanish", "Dirigir y seguir una reunión en español"],
      ["Write clear professional emails", "Escribir correos profesionales claros"],
      ["Handle small talk with confidence", "Manejar la conversación informal con confianza"],
    ],
    requirements: [
      ["No Spanish required", "No necesitas saber español"],
      ["15 minutes a day", "15 minutos al día"],
    ],
    modules: [
      [
        ["First conversations", "Primeras conversaciones"],
        [
          ["Greetings and introductions", "Saludos y presentaciones", 8],
          ["Formal vs informal you", "Tú frente a usted", 9],
          ["Talking about your job", "Hablar de tu trabajo", 11],
        ],
      ],
      [
        ["Meetings", "Reuniones"],
        [
          ["Scheduling a meeting", "Programar una reunión", 10],
          ["Giving opinions politely", "Dar opiniones con cortesía", 12],
          ["Meeting phrasebook", "Frases para reuniones", 5, "article"],
        ],
      ],
      [
        ["Writing", "Escritura"],
        [
          ["Professional emails", "Correos profesionales", 13],
          ["Following up and closing", "Seguimiento y cierre", 10],
        ],
      ],
    ],
  }),
  course({
    slug: "confident-english-presentations",
    title: ["Confident English for Presentations", "Inglés con confianza para presentaciones"],
    subtitle: [
      "Structure, language and delivery for non-native speakers.",
      "Estructura, lenguaje y expresión para hablantes no nativos.",
    ],
    description: [
      "Present ideas clearly in English. Learn signposting language, storytelling structures and delivery techniques, then record and review your own talk.",
      "Presenta ideas con claridad en inglés. Aprende conectores, estructuras narrativas y técnicas de expresión, y después graba y revisa tu propia charla.",
    ],
    category: "languages",
    level: "intermediate",
    price: 49,
    rating: 4.8,
    ratingCount: 1180,
    students: 8930,
    instructorId: "lucia-fernandez",
    image: unsplash("1556761175-5973dc0f32e7"),
    updated: "2026-03-28",
    outcomes: [
      ["Structure a talk that flows", "Estructurar una charla con buen ritmo"],
      ["Use signposting language naturally", "Usar conectores con naturalidad"],
      ["Handle questions with confidence", "Responder preguntas con confianza"],
      ["Improve pronunciation and pacing", "Mejorar la pronunciación y el ritmo"],
    ],
    requirements: [
      ["Intermediate English (B1+)", "Inglés intermedio (B1+)"],
      ["A webcam or phone to record yourself", "Una webcam o un móvil para grabarte"],
    ],
    modules: [
      [
        ["Structure", "Estructura"],
        [
          ["Openings that hook", "Inicios que enganchan", 9],
          ["The three-part talk", "La charla en tres partes", 11],
        ],
      ],
      [
        ["Language", "Lenguaje"],
        [
          ["Signposting phrases", "Frases de transición", 12],
          ["Describing data and charts", "Describir datos y gráficos", 13],
          ["Phrase bank", "Banco de frases", 4, "article"],
        ],
      ],
      [
        ["Delivery", "Expresión"],
        [
          ["Pace, pauses and stress", "Ritmo, pausas y acento", 12],
          ["Handling Q&A", "Gestionar preguntas", 11],
        ],
      ],
    ],
  }),
  course({
    slug: "photography-fundamentals",
    title: ["Photography Fundamentals", "Fundamentos de fotografía"],
    subtitle: [
      "Master light, exposure and composition with any camera.",
      "Domina la luz, la exposición y la composición con cualquier cámara.",
    ],
    description: [
      "Get off auto mode for good. Kenji walks you through exposure, focus, composition and light on location in New York, with weekly assignments and feedback checklists.",
      "Deja el modo automático para siempre. Kenji te guía por la exposición, el enfoque, la composición y la luz en exteriores de Nueva York, con tareas semanales y listas de revisión.",
    ],
    category: "photography",
    level: "beginner",
    price: 69,
    originalPrice: 119,
    rating: 4.9,
    ratingCount: 6120,
    students: 52310,
    instructorId: "kenji-sato",
    image: unsplash("1502920917128-1aa500764cbd"),
    updated: "2026-07-11",
    bestseller: true,
    featured: true,
    outcomes: [
      ["Shoot confidently in manual mode", "Fotografiar con confianza en modo manual"],
      ["Control depth of field and motion", "Controlar la profundidad de campo y el movimiento"],
      ["Compose stronger images", "Componer imágenes más potentes"],
      ["Find and shape natural light", "Encontrar y moldear la luz natural"],
    ],
    requirements: [
      ["Any camera, including a phone", "Cualquier cámara, incluido un móvil"],
      ["No experience needed", "No necesitas experiencia"],
    ],
    modules: [
      [
        ["Exposure", "Exposición"],
        [
          ["Welcome to the streets", "Bienvenida a la calle", 5],
          ["The exposure triangle", "El triángulo de exposición", 16],
          ["Shooting in manual", "Disparar en manual", 14],
        ],
      ],
      [
        ["Composition", "Composición"],
        [
          ["Rule of thirds and beyond", "La regla de los tercios y más allá", 13],
          ["Leading lines and framing", "Líneas guía y encuadre", 12],
          ["Composition field guide", "Guía de campo de composición", 5, "article"],
        ],
      ],
      [
        ["Light", "Luz"],
        [
          ["Golden hour and blue hour", "Hora dorada y hora azul", 14],
          ["Window light portraits", "Retratos con luz de ventana", 15],
          ["Your first photo essay", "Tu primer ensayo fotográfico", 12],
        ],
      ],
    ],
  }),
  course({
    slug: "editing-in-lightroom",
    title: ["Editing in Lightroom", "Edición en Lightroom"],
    subtitle: [
      "A fast, consistent editing workflow from import to export.",
      "Un flujo de edición rápido y coherente, de la importación a la exportación.",
    ],
    description: [
      "Organize thousands of photos, develop a signature look and edit efficiently with presets, masks and color grading.",
      "Organiza miles de fotos, desarrolla un estilo propio y edita con eficiencia usando ajustes preestablecidos, máscaras y gradación de color.",
    ],
    category: "photography",
    level: "intermediate",
    price: 59,
    rating: 4.7,
    ratingCount: 1740,
    students: 13280,
    instructorId: "kenji-sato",
    image: unsplash("1452587925148-ce544e77e70d"),
    updated: "2026-02-19",
    outcomes: [
      ["Organize a catalog that scales", "Organizar un catálogo que escala"],
      ["Correct exposure and white balance", "Corregir la exposición y el balance de blancos"],
      ["Use masks for local edits", "Usar máscaras para ediciones locales"],
      ["Build your own presets", "Crear tus propios ajustes preestablecidos"],
    ],
    requirements: [
      ["Adobe Lightroom (trial is fine)", "Adobe Lightroom (vale la versión de prueba)"],
      ["Some photos to edit", "Algunas fotos para editar"],
    ],
    modules: [
      [
        ["Workflow", "Flujo de trabajo"],
        [
          ["Importing and culling", "Importar y seleccionar", 11],
          ["Collections and keywords", "Colecciones y palabras clave", 10],
        ],
      ],
      [
        ["Developing", "Revelado"],
        [
          ["Global adjustments", "Ajustes globales", 16],
          ["Masks and local edits", "Máscaras y ediciones locales", 18],
          ["Color grading", "Gradación de color", 15],
        ],
      ],
      [
        ["Your look", "Tu estilo"],
        [
          ["Creating presets", "Crear ajustes preestablecidos", 12],
          ["Export settings cheat sheet", "Chuleta de exportación", 4, "article"],
        ],
      ],
    ],
  }),
  course({
    slug: "mobile-photography",
    title: ["Mobile Photography", "Fotografía con el móvil"],
    subtitle: [
      "Pro-looking photos with the camera already in your pocket.",
      "Fotos de aspecto profesional con la cámara que ya llevas en el bolsillo.",
    ],
    description: [
      "A free mini-course on composition, light and quick edits for phone photographers. Perfect for social media, product shots and travel.",
      "Un minicurso gratuito sobre composición, luz y edición rápida para fotógrafos con móvil. Perfecto para redes sociales, producto y viajes.",
    ],
    category: "photography",
    level: "beginner",
    price: 0,
    rating: 4.6,
    ratingCount: 3420,
    students: 39870,
    instructorId: "kenji-sato",
    image: unsplash("1516035069371-29a1b244cc32"),
    updated: "2026-09-15",
    isNew: true,
    outcomes: [
      ["Use your phone's pro camera features", "Usar las funciones pro de la cámara del móvil"],
      ["Compose for social media formats", "Componer para formatos de redes sociales"],
      ["Shoot clean product photos at home", "Hacer fotos de producto limpias en casa"],
      ["Edit quickly on your phone", "Editar rápido en el móvil"],
    ],
    requirements: [
      ["Any recent smartphone", "Cualquier smartphone reciente"],
      ["No experience needed", "No necesitas experiencia"],
    ],
    modules: [
      [
        ["Your phone camera", "La cámara de tu móvil"],
        [
          ["Settings that matter", "Ajustes que importan", 7],
          ["Focus and exposure lock", "Bloqueo de enfoque y exposición", 6],
        ],
      ],
      [
        ["Shooting", "Fotografiar"],
        [
          ["Composition for small screens", "Composición para pantallas pequeñas", 9],
          ["Product photos at home", "Fotos de producto en casa", 11],
        ],
      ],
      [
        ["Editing", "Edición"],
        [
          ["Five-minute edits", "Ediciones en cinco minutos", 8],
          ["Editing apps compared", "Comparativa de apps de edición", 4, "article"],
        ],
      ],
    ],
  }),
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesByInstructor(slug: string) {
  return courses.filter((c) => c.instructorId === slug);
}
