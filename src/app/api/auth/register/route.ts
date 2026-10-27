import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { errorResponse, readJson } from "@/lib/http";
import { registerSchema } from "@/lib/validation/auth";
import { startSession } from "@/lib/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const parsed = registerSchema.safeParse(await readJson(request));
  if (!parsed.success) return errorResponse(parsed.error.issues[0].message, 400);

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return errorResponse("El email ya se encuentra registrado", 409);

  const user = await prisma.user.create({
    data: { name, email, password: await bcrypt.hash(password, 10) },
  });

  return startSession(user, "Registro exitoso", 201);
}