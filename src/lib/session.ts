import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken, hashToken } from "@/lib/auth";
import { setAccessCookie, setRefreshCookie } from "@/lib/cookies";

export async function startSession(
  user: User,
  message: string,
  status: number
): Promise<NextResponse> {
  const payload = { userId: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashToken(refreshToken) },
  });

  const response = NextResponse.json(
    { message, user: { id: user.id, name: user.name, role: user.role } },
    { status }
  );
  setAccessCookie(response, accessToken);
  setRefreshCookie(response, refreshToken);
  return response;
}