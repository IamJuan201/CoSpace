import type { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/current-user";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import AccountMenu from "@/components/layout/AccountMenu";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Brand from "./Brand";

export default async function Navbar(): Promise<ReactElement> {
  const t = await getTranslations("Nav");
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-(--line) bg-(--background)/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[68px] max-w-360 items-center justify-between gap-2 px-3 sm:h-[72px] sm:gap-3 sm:px-6 lg:h-20 lg:px-10">
        <div className="flex min-w-0 items-center gap-5 lg:gap-12">
          <Brand />
          <div className="hidden items-center gap-2 md:flex">
            <Link href="/" className="rounded-full px-3.5 py-2 text-sm font-medium text-(--muted) transition-colors hover:bg-(--surface) hover:text-(--ink)">
              {t("home")}
            </Link>
            <Link href="/spaces" className="rounded-full px-3.5 py-2 text-sm font-medium text-(--muted) transition-colors hover:bg-(--surface) hover:text-(--ink)">
              {t("spaces")}
            </Link>
            <Link href="/dashboard" className="rounded-full px-3.5 py-2 text-sm font-medium text-(--muted) transition-colors hover:bg-(--surface) hover:text-(--ink)">
              {t("dashboard")}
            </Link>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
          <span className="hidden rounded-full border border-(--line) bg-(--surface)/80 px-3.5 py-2 text-xs font-semibold text-(--muted) lg:inline-flex">◷ &nbsp;07:00 – 21:00</span>
          <ThemeToggle />
          <LocaleSwitcher />
          {user ? <AccountMenu name={user.name} role={user.role} /> : (
            <>
              <Link href="/login" className="hidden text-sm font-semibold text-(--muted) transition-colors hover:text-(--accent-deep) sm:inline-flex">
                {t("login")}
              </Link>
              <Link href="/register" className="rounded-full bg-(--accent-action) px-2.5 py-2 text-[11px] font-semibold text-white transition-colors hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-sm">
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
