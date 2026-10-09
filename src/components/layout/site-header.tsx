"use client";

import { HeartIcon, MenuIcon, SearchIcon, ShoppingBagIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMounted } from "@/hooks/use-mounted";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/store/auth";
import { useCommerce } from "@/lib/store/commerce";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { UserMenu } from "./user-menu";

const navItems = [
  { href: "/courses", key: "courses" },
  { href: "/instructors", key: "instructors" },
  { href: "/pricing", key: "pricing" },
  { href: "/blog", key: "blog" },
] as const;

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute -top-0.5 -right-0.5 grid min-w-4.5 place-items-center rounded-full bg-coral px-1 text-[0.65rem] leading-4.5 font-semibold text-foreground"
    >
      {count}
    </span>
  );
}

function HeaderSearch() {
  const t = useTranslations("Nav");
  const router = useRouter();
  return (
    <form
      role="search"
      className="relative hidden xl:block"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString().trim();
        router.push(q ? `/courses?q=${encodeURIComponent(q)}` : "/courses");
      }}
    >
      <label htmlFor="header-search" className="sr-only">
        {t("search")}
      </label>
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <input
        id="header-search"
        name="q"
        type="search"
        placeholder={t("searchPlaceholder")}
        className="h-9 w-56 rounded-full border border-input bg-card pr-3 pl-9 text-sm transition-[width,box-shadow] outline-none placeholder:text-muted-foreground focus:w-72 focus-visible:ring-3 focus-visible:ring-ring/40"
      />
    </form>
  );
}

export function SiteHeader() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const mounted = useMounted();
  const user = useAuth((s) => s.user);
  const cartCount = useCommerce((s) => s.cart.length);
  const wishlistCount = useCommerce((s) => s.wishlist.length);
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const session = mounted ? user : null;
  const counts = mounted ? { cart: cartCount, wishlist: wishlistCount } : { cart: 0, wishlist: 0 };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="container-page flex h-16 items-center gap-3">
        <Link href="/" className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <Logo />
          <span className="sr-only">{t("home")}</span>
        </Link>

        <nav aria-label={t("mainNav")} className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                    isActive(item.href) && "text-foreground",
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <HeaderSearch />
          <LanguageSwitcher className="hidden sm:inline-flex" />
          {session?.role !== "instructor" ? (
            <>
              <Link
                href="/learn/wishlist"
                aria-label={t("wishlistCount", { count: counts.wishlist })}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "relative hidden sm:inline-flex",
                )}
              >
                <HeartIcon aria-hidden="true" />
                <CountBadge count={counts.wishlist} />
              </Link>
              <Link
                href="/learn/cart"
                aria-label={t("cartCount", { count: counts.cart })}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
              >
                <ShoppingBagIcon aria-hidden="true" />
                <CountBadge count={counts.cart} />
              </Link>
            </>
          ) : null}

          {session ? (
            <>
              <Link
                href={session.role === "instructor" ? "/teach" : "/learn"}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "hidden md:inline-flex")}
              >
                {session.role === "instructor" ? t("teach") : t("myLearning")}
              </Link>
              <UserMenu user={session} />
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "lg" })}>
                {t("login")}
              </Link>
              <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "px-4")}>
                {t("signup")}
              </Link>
            </div>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" />}
              aria-label={t("openMenu")}
            >
              <MenuIcon aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm p-0">
              <SheetHeader className="border-b px-5 py-4">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label={t("mainNav")} className="flex flex-col gap-1 px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary aria-[current=page]:bg-secondary"
                  >
                    {t(item.key)}
                  </Link>
                ))}
                {session?.role !== "instructor" ? (
                  <Link
                    href="/learn/wishlist"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-secondary"
                  >
                    {t("wishlist")}
                  </Link>
                ) : null}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t p-5">
                <LanguageSwitcher className="self-start" />
                {session ? (
                  <Link
                    href={session.role === "instructor" ? "/teach" : "/learn"}
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ size: "xl" })}
                  >
                    {session.role === "instructor" ? t("teach") : t("myLearning")}
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className={buttonVariants({ size: "xl" })}
                    >
                      {t("signup")}
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className={buttonVariants({ variant: "outline", size: "xl" })}
                    >
                      {t("login")}
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
