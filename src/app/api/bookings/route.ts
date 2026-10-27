import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { authenticate, errorResponse, handleRouteError, readJson } from "@/lib/http";
import { createBookingSchema } from "@/lib/validation/booking";
import { validateBookingWindow } from "@/lib/booking-rules";
import { createBooking } from "@/lib/booking-service";

// El GET filtra por userId del token y no por un parámetro, así que nadie puede pedir las reservas de otro.
export async function GET(request: NextRequest) {
    const auth = authenticate(request);
    if (!auth.ok) return auth.response;

    const bookings = await prisma.booking.findMany({
        where: { userId: auth.payload.userId },
        include: { space: { select: { id: true, name: true, type: true, imageUrl: true } } },
        orderBy: { startTime: "desc" },
    });

    return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
    const auth = authenticate(request);
    if (!auth.ok) return auth.response;

    const parsed = createBookingSchema.safeParse(await readJson(request));
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message, 400);

    const start = new Date(parsed.data.startTime);
    const end = new Date(parsed.data.endTime);

  try {
    const hours = validateBookingWindow(start, end);
    const booking = await prisma.$transaction(
        (tx) =>
            createBooking(tx, { userId: auth.payload.userId, spaceId: parsed.data.spaceId, start, end, hours }),
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable } // La transacción Serializable evita la condición de carrera. Sin ella, dos peticiones simultáneas pasan la verificación de solapamiento y crean dos reservas para el mismo horario.
        );
        return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}