"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useMounted } from "@/hooks/use-mounted";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth, type Role } from "@/lib/store/auth";

export function RoleGuard({
  role,
  fullPage,
  children,
}: {
  role: Role;
  fullPage?: boolean;
  children: React.ReactNode;
}) {
  const t = useTranslations("Learn");
  const mounted = useMounted();
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  const allowed = mounted && user?.role === role;
  const hadUser = useRef(false);

  useEffect(() => {
    if (user) hadUser.current = true;
    if (!mounted || allowed) return;
    if (!user) {
      if (hadUser.current) return;
      router.replace(`/login?next=${encodeURIComponent(pathname + window.location.search)}`);
    } else {
      if (role === "student") toast.info(t("instructorRedirect"));
      router.replace(user.role === "instructor" ? "/teach" : "/learn");
    }
  }, [mounted, allowed, user, role, router, pathname, t]);

  if (!allowed) {
    return (
      <div className={fullPage ? "container-page py-10" : undefined} aria-busy="true">
        <span className="sr-only" role="status">
          {t("guardChecking")}
        </span>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mt-8 h-64 rounded-2xl" />
      </div>
    );
  }

  return children;
}
