import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getSiteUrl } from "./site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");

async function loadFonts() {
  const [regular, semibold, bold] = await Promise.all(
    ["Geist-Regular.ttf", "Geist-SemiBold.ttf", "Geist-Bold.ttf"].map((file) =>
      readFile(join(fontDir, file)),
    ),
  );
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Geist", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

const colors = {
  background: "#f9f8f5",
  foreground: "#1d1a2e",
  muted: "#5f5b70",
  primary: "#4b2fc4",
  primarySoft: "#ebe7fb",
  coral: "#f2896b",
  border: "#e7e4dc",
};

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: string[];
};

export async function renderOgImage({ eyebrow, title, subtitle, meta = [] }: OgCardProps) {
  const fonts = await loadFonts();
  const titleSize = title.length > 70 ? 56 : title.length > 40 ? 64 : 76;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: colors.background,
        fontFamily: "Geist",
        color: colors.foreground,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -180,
          right: -140,
          width: 560,
          height: 560,
          borderRadius: 9999,
          background: colors.primarySoft,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 120,
          width: 150,
          height: 150,
          borderRadius: 9999,
          background: colors.coral,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -90,
          right: 260,
          width: 220,
          height: 220,
          borderRadius: 9999,
          border: `28px solid ${colors.primary}`,
          opacity: 0.12,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="64" height="64" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="9" fill={colors.primary} />
          <path
            d="M10 9v14h12"
            fill="none"
            stroke="#fff"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="21.5" cy="11.5" r="3.2" fill={colors.coral} />
        </svg>
        <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>Learnora</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 860 }}>
        <div style={{ display: "flex" }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: colors.primary,
              background: colors.primarySoft,
              padding: "8px 20px",
              borderRadius: 9999,
            }}
          >
            {eyebrow}
          </span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: titleSize,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -2,
            display: "block",
            lineClamp: 3,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 20,
              fontSize: 30,
              lineHeight: 1.35,
              color: colors.muted,
              display: "block",
              lineClamp: 2,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${colors.border}`,
          paddingTop: 28,
          fontSize: 24,
          color: colors.muted,
        }}
      >
        <div style={{ display: "flex", gap: 32 }}>
          {meta.map((item) => (
            <span key={item} style={{ fontWeight: 600, color: colors.foreground }}>
              {item}
            </span>
          ))}
        </div>
        <span>{new URL(getSiteUrl()).host}</span>
      </div>
    </div>,
    { ...ogSize, fonts },
  );
}
