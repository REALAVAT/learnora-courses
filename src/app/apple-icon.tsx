import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#4b2fc4",
      }}
    >
      <svg width="132" height="132" viewBox="4 4 24 24">
        <path
          d="M10 9v14h12"
          fill="none"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="21.5" cy="11.5" r="3.2" fill="#f2896b" />
      </svg>
    </div>,
    size,
  );
}
