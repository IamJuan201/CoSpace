import { z } from "zod";

// Con esto parsed.data queda tipado sin any y el email llega normalizado a minúsculas, así que Admin@x.com y admin@x.com no se tratan como cuentas distintas.

export const registerSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});