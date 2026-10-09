import { getTranslations } from "next-intl/server";
import { RoleGuard } from "@/components/app/role-guard";

export default async function PlayerLayout({ children }: LayoutProps<"/[locale]/learn">) {
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
