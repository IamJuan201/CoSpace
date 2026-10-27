import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, errorResponse, IdRouteContext, readJson } from "@/lib/http";
import { updateSpaceSchema } from "@/lib/validation/space";

export async function PATCH(request: NextRequest, { params }: IdRouteContext): Promise<NextResponse> {
  const auth = authenticate(request, "ADMIN");
  if (!auth.ok) return auth.response;

  const parsed = updateSpaceSchema.safeParse(await readJson(request));
  if (!parsed.success) return errorResponse(parsed.error.issues[0].message, 400);

  const { id } = await params;
  const exists = await prisma.space.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return errorResponse("Espacio no encontrado", 404);

  const updated = await prisma.space.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}
