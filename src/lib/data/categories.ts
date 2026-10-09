import { unsplash } from "@/lib/images";
import type { Category, CategoryId } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "design",
    image: unsplash("1586717791821-3f44a563fa4c", 900),
    description: {
      en: "UI, UX research and design systems",
      es: "UI, investigación UX y sistemas de diseño",
    },
  },
  {
    id: "development",
    image: unsplash("1461749280684-dccba630e2f6", 900),
    description: {
      en: "React, TypeScript and Python",
      es: "React, TypeScript y Python",
    },
  },
  {
    id: "data",
    image: unsplash("1504868584819-f8e8b4b6d7e3", 900),
    description: {
      en: "SQL, analytics and practical AI",
      es: "SQL, analítica e IA práctica",
    },
  },
  {
    id: "business",
    image: unsplash("1454165804606-c3d57bc86b40", 900),
    description: {
      en: "Product, finance and growth",
      es: "Producto, finanzas y crecimiento",
    },
  },
  {
    id: "languages",
    image: unsplash("1546410531-bb4caa6b424d", 900),
    description: {
      en: "Business Spanish and English",
      es: "Español y inglés para negocios",
    },
  },
  {
    id: "photography",
    image: unsplash("1606857521015-7f9fcf423740", 900),
    description: {
      en: "Camera craft, light and editing",
      es: "Técnica, luz y edición",
    },
  },
];

export const categoryIds = categories.map((c) => c.id) as CategoryId[];
