import { z } from "zod";

export const loginValidator = z.object({
  email: z.string().email("Введіть коректний email"),
  password: z.string().min(8, "Мінімальна довжина паролю - 8 символів"),
});
