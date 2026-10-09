import { getTranslations, setRequestLocale } from "next-intl/server";
import { RoleGuard } from "@/components/app/role-guard";
import type { Locale } from "@/i18n/routing";

export default async function PlayerLayout({ children, params }: LayoutProps<"/[locale]/learn">) {
  setRequestLocale((await params).locale as Locale);
  const t = await getTranslations("Nav");
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t("skip")}
      </a>
      <RoleGuard role="student" fullPage>
        {children}
      </RoleGuard>
    </>
  );
}
