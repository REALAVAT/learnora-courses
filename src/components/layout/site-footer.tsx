import { getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/logo";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { NewsletterForm } from "./newsletter-form";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  const columns = [
    {
      title: t("learn"),
      links: [
        { href: "/courses", label: t("allCourses") },
        { href: "/courses?category=design", label: t("design") },
        { href: "/courses?category=development", label: t("development") },
        { href: "/courses?category=business", label: t("business") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/instructors", label: t("about") },
        { href: "/pricing", label: t("pricing") },
        { href: "/blog", label: t("blog") },
        { href: "/signup?role=instructor", label: t("teach") },
      ],
    },
    {
      title: t("account"),
      links: [
        { href: "/login", label: t("login") },
        { href: "/signup", label: t("signup") },
        { href: "/learn", label: t("myLearning") },
      ],
    },
  ];

  return (
    <footer className="no-print mt-auto border-t bg-card">
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.4fr_2fr]">
        <div className="flex flex-col gap-5">
          <Link href="/" className="self-start rounded-lg">
            <Logo />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">{t("newsletterTitle")}</p>
            <p className="text-sm text-muted-foreground">{t("newsletterBody")}</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-semibold">{col.title}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col gap-3 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            {t("rights", { year: 2026 })} <span className="hidden sm:inline">·</span>{" "}
            <span className="block sm:inline">{t("address")}</span>
          </p>
          <p>
            {t("demo")} {siteConfig.authorName} —{" "}
            <a
              href={siteConfig.authorUrl}
              className="font-medium text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener"
            >
              ahmadkhajeh.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
