import type { ReactElement } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCurrentUser } from "@/lib/current-user";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import AccountMenu from "@/components/layout/AccountMenu";
import Brand from "./Brand";

export default async function Navbar(): Promise<ReactElement> {
  const t = await getTranslations("Nav");
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e5eeff] bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-17 max-w-360 items-center justify-between gap-3 px-4 sm:px-6 lg:h-20 lg:px-10">
        <div className="flex min-w-0 items-center gap-5 lg:gap-10">
          <Brand />
          <div className="hidden items-center gap-1 md:flex">
            <Link href="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-(--muted) transition-colors hover:bg-[#eff4ff] hover:text-(--ink)">
              {t("home")}
            </Link>
            <Link href="/spaces" className="rounded-lg px-3 py-2 text-sm font-semibold text-(--muted) transition-colors hover:bg-[#eff4ff] hover:text-(--ink)">
              {t("spaces")}
            </Link>
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-semibold text-(--muted) transition-colors hover:bg-[#eff4ff] hover:text-(--ink)">
              {t("dashboard")}
            </Link>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <span className="hidden rounded-full bg-[#eff4ff] px-3 py-1.5 text-xs font-semibold text-(--muted) lg:inline-flex">◷ &nbsp;07:00 – 21:00</span>
          <LocaleSwitcher />
          {user ? <AccountMenu name={user.name} role={user.role} /> : (
            <>
              <Link href="/login" className="hidden text-sm font-semibold text-(--muted) transition-colors hover:text-(--accent-deep) sm:inline-flex">
                {t("login")}
              </Link>
              <Link href="/register" className="rounded-lg bg-(--accent-deep) px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-(--accent) sm:px-4 sm:text-sm">
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
