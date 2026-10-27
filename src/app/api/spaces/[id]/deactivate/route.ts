import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, errorResponse, IdRouteContext } from "@/lib/http";

export async function PATCH(request: NextRequest, { params }: IdRouteContext): Promise<NextResponse> {
    const auth = authenticate(request, "ADMIN");
    if (!auth.ok) return auth.response;

    const { id } = await params;
    const space = await prisma.space.findUnique({ where: { id }, select: { id: true } });
    if (!space) return errorResponse("Espacio no encontrado", 404);

    const updated = await prisma.space.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json(updated);
}