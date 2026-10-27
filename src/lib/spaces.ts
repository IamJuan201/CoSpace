import { Space } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getActiveSpaces(): Promise<Space[]> {
  return prisma.space.findMany({
    where: { isActive: true },
    orderBy: [{ createdAt: "desc" }, { name: "asc" }],
  });
}

export function getActiveSpaceById(id: string): Promise<Space | null> {
  return prisma.space.findFirst({ where: { id, isActive: true } });
}