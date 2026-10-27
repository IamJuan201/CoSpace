import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSpaces } from "@/lib/spaces";
import { authenticate, errorResponse, readJson } from "@/lib/http";
import { createSpaceSchema } from "@/lib/validation/space";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const includeInactive = request.nextUrl.searchParams.get("includeInactive") === "true";
  if (!includeInactive) return NextResponse.json(await getActiveSpaces());

  const auth = authenticate(request, "ADMIN");
  if (!auth.ok) return auth.response;

  const spaces = await prisma.space.findMany({ orderBy: [{ createdAt: "desc" }, { name: "asc" }] });
  return NextResponse.json(spaces);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = authenticate(request, "ADMIN");
  if (!auth.ok) return auth.response;

  const parsed = createSpaceSchema.safeParse(await readJson(request));
  if (!parsed.success) return errorResponse(parsed.error.issues[0].message, 400);

  const space = await prisma.space.create({ data: parsed.data });
  return NextResponse.json(space, { status: 201 });
}