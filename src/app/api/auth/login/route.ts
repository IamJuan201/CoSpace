import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { errorResponse, readJson } from "@/lib/http";
import { loginSchema } from "@/lib/validation/auth";
import { startSession } from "@/lib/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const parsed = loginSchema.safeParse(await readJson(request));
  if (!parsed.success) return errorResponse(parsed.error.issues[0].message, 400);

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordMatch) return errorResponse("Credenciales inválidas", 401);

  return startSession(user, "Login exitoso", 200);
}