import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site";

export function AppFooter() {
  const t = useTranslations("Footer");
  return (
    <footer className="no-print border-t py-6">
      <p className="container-page text-center text-xs text-muted-foreground">
        {t("demo")} {siteConfig.authorName} —{" "}
        <a
          href={siteConfig.authorUrl}
          target="_blank"
          rel="noopener"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          ahmadkhajeh.com
        </a>
      </p>
    </footer>
  );
}
