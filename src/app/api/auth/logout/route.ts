import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRefreshToken } from "@/lib/auth";
import { clearAuthCookies } from "@/lib/cookies";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (refreshToken) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      await prisma.user.update({ where: { id: payload.userId }, data: { refreshToken: null } });
    } catch {
      // Si el token ya expiró, igual se borran las cookies
    }
  }

  const response = NextResponse.json({ message: "Sesión cerrada" });
  clearAuthCookies(response);
  return response;
}