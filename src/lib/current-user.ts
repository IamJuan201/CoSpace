import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashToken, type TokenPayload, verifyAccessToken, verifyRefreshToken } from "@/lib/auth";

export interface CurrentUser {
  name: string;
  role: "USER" | "ADMIN";
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
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
});
