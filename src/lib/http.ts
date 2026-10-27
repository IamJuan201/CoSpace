import { NextRequest, NextResponse } from "next/server";
import { Prisma, Role } from "@prisma/client";
import { TokenPayload, verifyAccessToken } from "@/lib/auth";

type AuthResult =
  | { ok: true; payload: TokenPayload }
  | { ok: false; response: NextResponse };

export function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function authenticate(request: NextRequest, requiredRole?: Role): AuthResult {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return { ok: false, response: errorResponse("No autorizado", 401) };

  try {
    const payload = verifyAccessToken(token);
    if (requiredRole && payload.role !== requiredRole) {
      return { ok: false, response: errorResponse("Acceso denegado", 403) };
    }
    return { ok: true, payload };
  } catch {
    return { ok: false, response: errorResponse("Token inválido o expirado", 401) };
  }
}

export async function readJson(request: NextRequest): Promise<unknown> {
  return request.json().catch(() => null);
}


export class HttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export interface IdRouteContext {
  params: Promise<{ id: string }>;
}

export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof HttpError) return errorResponse(error.message, error.status);

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
    return errorResponse("Conflicto de concurrencia, intenta de nuevo", 409);
  }

  console.error(error);
  return errorResponse("Error interno del servidor", 500);
}