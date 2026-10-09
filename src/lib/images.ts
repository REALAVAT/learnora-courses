export function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const images = {
  hero: unsplash("1522202176988-66273c2fd55f"),
  heroSecondary: unsplash("1531482615713-2afd69097998", 900),
  teach: unsplash("1524178232363-1fb2b075b655"),
  business: unsplash("1542744173-8e7e53415bb0"),
} as const;
