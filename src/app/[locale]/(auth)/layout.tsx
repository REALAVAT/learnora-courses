import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { unsplash } from "@/lib/images";

export default async function AuthLayout({ children, params }: LayoutProps<"/[locale]">) {
  setRequestLocale((await params).locale as Locale);
  const t = await getTranslations("Auth");
  const tn = await getTranslations("Nav");
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,0.9fr)]">
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {tn("skip")}
      </a>
      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between px-5 sm:px-8">
          <Link href="/" className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <Logo />
            <span className="sr-only">{tn("home")}</span>
          </Link>
          <LanguageSwitcher />
        </header>
        <main id="main" className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
      <aside className="relative hidden overflow-hidden bg-primary lg:block">
        <Image
          src={unsplash("1522202176988-66273c2fd55f", 1200)}
          alt=""
          fill
          priority
          sizes="45vw"
          className="object-cover opacity-55 mix-blend-luminosity"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.08_282)] via-primary/40 to-transparent"
        />
        <figure className="absolute inset-x-10 bottom-12 text-white">
          <blockquote className="text-2xl leading-snug font-medium text-balance">{t("quote")}</blockquote>
          <figcaption className="mt-4 text-sm text-white/80">{t("quoteAuthor")}</figcaption>
        </figure>
      </aside>
    </div>
  );
}
