import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RoleGuard } from "@/components/app/role-guard";
import { TeachNav } from "@/components/app/teach-nav";
import { AppFooter } from "@/components/layout/app-footer";
import { SiteHeader } from "@/components/layout/site-header";
import type { Locale } from "@/i18n/routing";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function TeachLayout({ children, params }: LayoutProps<"/[locale]/teach">) {
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
      <SiteHeader />
      <div className="container-page grid flex-1 gap-6 py-6 lg:grid-cols-[220px_1fr] lg:gap-10 lg:py-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <TeachNav />
        </aside>
        <main id="main" className="min-w-0">
          <RoleGuard role="instructor">{children}</RoleGuard>
        </main>
      </div>
      <AppFooter />
    </>
  );
}
