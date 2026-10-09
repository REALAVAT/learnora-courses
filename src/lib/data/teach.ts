import { unsplash } from "@/lib/images";

export const revenueByMonth = [
  { month: "2025-10", revenue: 18420, enrollments: 612 },
  { month: "2025-11", revenue: 22150, enrollments: 734 },
  { month: "2025-12", revenue: 27930, enrollments: 905 },
  { month: "2026-01", revenue: 31280, enrollments: 1012 },
  { month: "2026-02", revenue: 26710, enrollments: 868 },
  { month: "2026-03", revenue: 29840, enrollments: 951 },
  { month: "2026-04", revenue: 33560, enrollments: 1094 },
  { month: "2026-05", revenue: 35120, enrollments: 1140 },
  { month: "2026-06", revenue: 32480, enrollments: 1052 },
  { month: "2026-07", revenue: 38940, enrollments: 1263 },
  { month: "2026-08", revenue: 41270, enrollments: 1338 },
  { month: "2026-09", revenue: 44860, enrollments: 1452 },
];

export const trafficSources = [
  { source: "search", value: 38 },
  { source: "marketplace", value: 29 },
  { source: "social", value: 17 },
  { source: "email", value: 10 },
  { source: "referral", value: 6 },
] as const;

export const completionFunnel = [
  { stage: "enrolled", value: 100 },
  { stage: "started", value: 86 },
  { stage: "halfway", value: 61 },
  { stage: "completed", value: 42 },
  { stage: "certified", value: 35 },
] as const;

export const watchTimeByWeekday = [
  { day: 0, minutes: 2140 },
  { day: 1, minutes: 3820 },
  { day: 2, minutes: 4010 },
  { day: 3, minutes: 3760 },
  { day: 4, minutes: 3190 },
  { day: 5, minutes: 2380 },
  { day: 6, minutes: 2620 },
];

const firstNames = [
  "Olivia", "Liam", "Sofía", "Noah", "Ava", "Mateo", "Emma", "Lucas", "Mia", "Ethan",
  "Valentina", "James", "Chloe", "Benjamin", "Isabella", "Daniel", "Grace", "Samuel", "Zoe", "Leo",
  "Hana", "Omar", "Elena", "Kai",
];
const lastNames = [
  "Johnson", "Martínez", "Nguyen", "Brown", "Kim", "Rossi", "Williams", "Silva", "Garcia", "Patel",
  "Müller", "Davis", "Okoye", "Lopez", "Tanaka", "Wilson", "Cohen", "Ramos", "Clark", "Ali",
  "Park", "Haddad", "Novak", "Moreno",
];
const cities = [
  "New York, USA", "Madrid, Spain", "Toronto, Canada", "São Paulo, Brazil", "London, UK", "Seoul, South Korea",
  "Mexico City, Mexico", "Berlin, Germany", "Austin, USA", "Sydney, Australia", "Lisbon, Portugal", "Tokyo, Japan",
];
const avatars = [
  "1534528741775-53994a69daeb", "1507003211169-0a1dd7228f2d", "1508214751196-bcfd4ca60f91",
  "1519085360753-af0119f7cbe7", "1539571696357-5a69c17a67c6", "1560250097-0b93528c311a",
];

export type StudentRow = {
  id: string;
  name: string;
  email: string;
  location: string;
  avatar?: string;
  courseSlug: string;
  progress: number;
  enrolledAt: string;
  lastActive: string;
};

export const instructorStudents: StudentRow[] = Array.from({ length: 24 }, (_, i) => {
  const first = firstNames[i];
  const last = lastNames[(i * 7) % lastNames.length];
  const enrolledDays = 3 + ((i * 13) % 160);
  const activeDays = (i * 5) % Math.max(enrolledDays, 1);
  return {
    id: `s${i + 1}`,
    name: `${first} ${last}`,
    email: `${first}.${last}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .concat("@example.com"),
    location: cities[i % cities.length],
    avatar: i % 4 === 3 ? undefined : unsplash(avatars[i % avatars.length], 120),
    courseSlug: i % 3 === 0 ? "figma-design-systems" : "ui-design-foundations",
    progress: (i * 37) % 101,
    enrolledAt: new Date(Date.UTC(2026, 9, 9) - enrolledDays * 86_400_000).toISOString(),
    lastActive: new Date(Date.UTC(2026, 9, 9) - activeDays * 86_400_000).toISOString(),
  };
});
