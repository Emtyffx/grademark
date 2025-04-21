import { z } from "zod";

export const registerValidator = z.object({
  email: z.string().email("Введіть коректний email"),
  name: z.string().min(8, "Мінімальна довжина імені - 8 символів"),
  password: z.string().min(8, "Мінімальна довжина паролю - 8 символів"),
});
