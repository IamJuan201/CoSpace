import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/http";
import { generateAccessToken, hashToken, TokenPayload, verifyRefreshToken } from "@/lib/auth";
import { setAccessCookie } from "@/lib/cookies";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) return errorResponse("No hay sesión activa", 401);

  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return errorResponse("Token inválido o expirado", 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user?.refreshToken || user.refreshToken !== hashToken(refreshToken)) {
    return errorResponse("Sesión no válida", 401);
  }

  const response = NextResponse.json({ message: "Token renovado" });
  setAccessCookie(response, generateAccessToken({ userId: user.id, role: user.role }));
  return response;
}