export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "https://courses.ahmadkhajeh.com";
}

export const siteConfig = {
  name: "Learnora",
  legalName: "Learnora, Inc.",
  email: "hello@learnora.example",
  city: "New York",
  region: "NY",
  country: "US",
  street: "175 Varick Street",
  postalCode: "10014",
  authorName: "Ahmad Khajeh",
  authorUrl: "https://ahmadkhajeh.com",
  social: {
    x: "https://x.com",
    linkedin: "https://www.linkedin.com",
    youtube: "https://www.youtube.com",
  },
} as const;
