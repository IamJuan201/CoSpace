import type { ReactElement } from "react";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { hashToken, type TokenPayload, verifyAccessToken, verifyRefreshToken } from "@/lib/auth";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import AccountMenu from "@/components/layout/AccountMenu";
import Brand from "./Brand";

async function getCurrentUser(): Promise<{ name: string; role: "USER" | "ADMIN" } | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;
    let payload: TokenPayload | null = null;
    let usedRefreshToken = false;

    try {
      if (accessToken) payload = verifyAccessToken(accessToken);
    } catch {
      // Si expiró el token de acceso, se comprueba el de renovación.
    }
    if (!payload) {
      try {
        if (refreshToken) {
          payload = verifyRefreshToken(refreshToken);
          usedRefreshToken = true;
        }
      } catch {
        // No hay una sesión válida.
      }
    }
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { name: true, role: true, refreshToken: true },
    });
    if (!user || (usedRefreshToken && user.refreshToken !== hashToken(refreshToken!))) return null;
    return { name: user.name, role: user.role };
  } catch {
    return null;
  }
}

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