import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  email: z.string().email("Email inválido").optional(),
});