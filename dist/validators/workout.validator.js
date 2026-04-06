"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addExerciseSchema = exports.createWorkoutTypeSchema = exports.assignWorkoutSchema = void 0;
const zod_1 = require("zod");
exports.assignWorkoutSchema = zod_1.z.object({
    studentId: zod_1.z.string().uuid("ID inválido"),
    workoutTypeId: zod_1.z.string().uuid("ID inválido"),
    dayOfWeek: zod_1.z.number().min(0).max(6),
});
exports.createWorkoutTypeSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome muito curto"),
});
exports.addExerciseSchema = zod_1.z.object({
    workoutTypeId: zod_1.z.string().uuid(),
    exerciseId: zod_1.z.string().uuid(),
    kg: zod_1.z.number().optional(),
    reps: zod_1.z.string().optional(),
    sets: zod_1.z.number().optional(),
    restTime: zod_1.z.number().optional(),
    observation: zod_1.z.string().optional(),
    videoUrl: zod_1.z.string().url().optional().or(zod_1.z.literal("")),
    order: zod_1.z.number().optional(),
});
