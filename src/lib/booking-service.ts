import { Booking, BookingStatus, Prisma } from "@prisma/client";
import { HttpError } from "@/lib/http";
import { MAX_FUTURE_BOOKINGS } from "@/lib/booking-rules";

interface NewBookingInput {
  userId: string;
  spaceId: string;
  start: Date;
  end: Date;
  hours: number;
}

export async function createBooking(
  tx: Prisma.TransactionClient,
  input: NewBookingInput
): Promise<Booking> {
  const { userId, spaceId, start, end, hours } = input;

  const space = await tx.space.findUnique({ where: { id: spaceId } });
  if (!space) throw new HttpError("Espacio no encontrado", 404);
  if (!space.isActive) throw new HttpError("El espacio está desactivado", 409);

  const overlapping: Prisma.BookingWhereInput = {
    status: BookingStatus.CONFIRMED,
    startTime: { lt: end },
    endTime: { gt: start },
  };

  if (await tx.booking.findFirst({ where: { ...overlapping, spaceId } })) {
    throw new HttpError("El espacio ya está reservado en ese horario", 409);
  }
  if (await tx.booking.findFirst({ where: { ...overlapping, userId } })) {
    throw new HttpError("Ya tienes una reserva confirmada en ese horario", 409);
  }

  const futureCount = await tx.booking.count({
    where: { userId, status: BookingStatus.CONFIRMED, startTime: { gt: new Date() } },
  });
  if (futureCount >= MAX_FUTURE_BOOKINGS) {
    throw new HttpError(`Ya tienes ${MAX_FUTURE_BOOKINGS} reservas futuras confirmadas`, 409);
  }

  return tx.booking.create({
    data: { userId, spaceId, startTime: start, endTime: end, totalPrice: hours * space.pricePerHour },
  });
}