import Link from "next/link";
import { geistSans } from "@/lib/fonts";
import "./globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="grid min-h-screen place-items-center bg-background p-6 font-sans text-foreground">
        <div className="text-center">
          <p className="font-mono text-sm text-muted-foreground">404</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
          <Link
            href="/en"
            className="mt-6 inline-block font-medium text-primary underline-offset-4 hover:underline"
          >
            Back to Learnora
          </Link>
        </div>
      </body>
    </html>
  );
}
