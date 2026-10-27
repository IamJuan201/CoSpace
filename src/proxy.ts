import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { TokenPayload, verifyAccessToken, verifyRefreshToken } from "@/lib/auth";

const handleI18n = createMiddleware(routing);

interface LocalizedPath {
  locale: string;
  path: string;
}

function readSession(request: NextRequest): TokenPayload | null {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  try {
    if (accessToken) return verifyAccessToken(accessToken);
  } catch {
    // Access token expirado: se intenta con el refresh token
  }

  try {
    if (refreshToken) return verifyRefreshToken(refreshToken);
  } catch {
    // Tampoco hay refresh token válido
  }

  return null;
}

function splitLocale(pathname: string): LocalizedPath | null {
  const [, first, ...rest] = pathname.split("/");
  if (!routing.locales.some((locale) => locale === first)) return null;
  return { locale: first, path: `/${rest.join("/")}` };
}

function isUnder(path: string, base: string): boolean {
  return path === base || path.startsWith(`${base}/`);
}

function redirectTo(request: NextRequest, destination: string): NextResponse {
  return NextResponse.redirect(new URL(destination, request.url));
}

export function proxy(request: NextRequest): NextResponse {
  const localized = splitLocale(request.nextUrl.pathname);

  if (localized) {
    const { locale, path } = localized;
    const isAdminPath = isUnder(path, "/admin");

    if (isAdminPath || isUnder(path, "/dashboard")) {
      const session = readSession(request);
      if (!session) return redirectTo(request, `/${locale}/login`);
      if (isAdminPath && session.role !== "ADMIN") {
        return redirectTo(request, `/${locale}/dashboard`);
      }
    }
  }

  return handleI18n(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};