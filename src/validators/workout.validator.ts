import { z } from "zod";

export const assignWorkoutSchema = z.object({
  studentId: z.string().uuid("ID inválido"),
  workoutTypeId: z.string().uuid("ID inválido"),
  dayOfWeek: z.number().min(0).max(6),
});

export const createWorkoutTypeSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
});

export const addExerciseSchema = z.object({
  workoutTypeId: z.string().uuid(),
  exerciseId: z.string().uuid(),
  kg: z.number().optional(),
  reps: z.string().optional(),
  sets: z.number().optional(),
  restTime: z.number().optional(),
  observation: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().optional(),
});