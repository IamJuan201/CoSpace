import { z } from "zod";

const isoDate = z
  .string()
  .datetime({ offset: true, message: "Fecha inválida: usa formato ISO 8601" });

export const createBookingSchema = z.object({
  spaceId: z.string().min(1, "El espacio es obligatorio"),
  startTime: isoDate,
  endTime: isoDate,
});