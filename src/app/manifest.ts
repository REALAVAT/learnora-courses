import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Learnora — Online courses",
    short_name: "Learnora",
    description: "Project-based video courses, quizzes and certificates from working professionals.",
    start_url: "/en",
    display: "standalone",
    background_color: "#f9f8f5",
    theme_color: "#f9f8f5",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
