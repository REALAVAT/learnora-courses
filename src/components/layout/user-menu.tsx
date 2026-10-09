"use client";

import {
  AwardIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ReceiptIcon,
  RepeatIcon,
  SettingsIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import { initials } from "@/lib/format";
import { useAuth, type DemoUser } from "@/lib/store/auth";
import { startDemoSession } from "@/lib/store/demo";

export function UserAvatar({ user, className }: { user: Pick<DemoUser, "name" | "avatar">; className?: string }) {
  return (
    <Avatar className={className}>
      <AvatarImage src={user.avatar} alt="" />
      <AvatarFallback>{initials(user.name)}</AvatarFallback>
    </Avatar>
  );
}

export function UserMenu({ user }: { user: DemoUser }) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const logout = useAuth((s) => s.logout);
  const isInstructor = user.role === "instructor";

  function switchRole() {
    const next = isInstructor ? "student" : "instructor";
    startDemoSession(next, locale);
    router.push(next === "instructor" ? "/teach" : "/learn");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("account")}
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <UserAvatar user={user} className="size-9" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="text-sm font-medium text-foreground">{user.name}</span>
            <span className="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isInstructor ? (
            <DropdownMenuItem onClick={() => router.push("/teach")}>
              <LayoutDashboardIcon aria-hidden="true" />
              {t("teach")}
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem onClick={() => router.push("/learn")}>
                <BookOpenIcon aria-hidden="true" />
                {t("myLearning")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/learn/certificates")}>
                <AwardIcon aria-hidden="true" />
                {t("certificates")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/learn/orders")}>
                <ReceiptIcon aria-hidden="true" />
                {t("orders")}
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={() => router.push(isInstructor ? "/teach/settings" : "/learn/settings")}>
            <SettingsIcon aria-hidden="true" />
            {t("settings")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={switchRole}>
          <RepeatIcon aria-hidden="true" />
          {isInstructor ? t("switchToStudent") : t("switchToInstructor")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOutIcon aria-hidden="true" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
