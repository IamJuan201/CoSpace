import { NextRequest, NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authenticate, errorResponse, handleRouteError, IdRouteContext } from "@/lib/http";
import { assertCancellableByUser } from "@/lib/booking-rules";

export async function PATCH(request: NextRequest, { params }: IdRouteContext) {
  const auth = authenticate(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });

  const isAdmin = auth.payload.role === "ADMIN";
  const isOwner = booking?.userId === auth.payload.userId;
  if (!booking || (!isOwner && !isAdmin)) {
    return errorResponse("Reserva no encontrada", 404); // Reserva ajena 404 y no 403. Así no se revela que ese id existe
  }

  if (booking.status === BookingStatus.CANCELLED) {
    return errorResponse("La reserva ya está cancelada", 409);
  }

  try {
    if (!isAdmin) assertCancellableByUser(booking.startTime); // El admin no tiene el límite de 2 horas, el usuario si
  } catch (error) {
    return handleRouteError(error);
  }

  const cancelled = await prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CANCELLED },
  });
  return NextResponse.json(cancelled);
}