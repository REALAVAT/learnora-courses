import { CompassIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page grid flex-1 place-items-center py-24">
        <div className="flex max-w-md flex-col items-center text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
            <CompassIcon aria-hidden="true" className="size-7" />
          </span>
          <p className="mt-6 font-mono text-sm text-muted-foreground">404</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-3 text-muted-foreground">{t("body")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className={buttonVariants({ size: "xl" })}>
              {t("home")}
            </Link>
            <Link href="/courses" className={buttonVariants({ variant: "outline", size: "xl" })}>
              {t("browse")}
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
