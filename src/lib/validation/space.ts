import { z } from "zod";
import { SpaceType } from "@prisma/client";

export const createSpaceSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  type: z.enum(SpaceType, { message: "Tipo de espacio inválido" }),
  pricePerHour: z
    .number({ message: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0"),
  imageUrl: z.url("URL de imagen inválida").nullish(),
});

export const updateSpaceSchema = createSpaceSchema
  .partial()
  .extend({ isActive: z.boolean().optional() })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envía al menos un campo para actualizar",
  });