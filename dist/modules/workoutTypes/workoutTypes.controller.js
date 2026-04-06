"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkoutType = exports.removeExerciseFromWorkoutType = exports.updateWorkoutTypeExercise = exports.addExerciseToWorkoutType = exports.getWorkoutTypes = exports.createWorkoutType = void 0;
const database_1 = require("../../config/database");
const createWorkoutType = async (req, res) => {
    try {
        const { name } = req.body;
        const workoutType = await database_1.prisma.workoutType.create({
            data: { name, trainerId: req.user.id },
        });
        return res.status(201).json(workoutType);
    }
    catch {
        return res.status(500).json({ error: "Erro ao criar tipo de treino" });
    }
};
exports.createWorkoutType = createWorkoutType;
const getWorkoutTypes = async (req, res) => {
    try {
        const workoutTypes = await database_1.prisma.workoutType.findMany({
            where: { trainerId: req.user.id },
            include: {
                exercises: {
                    include: { exercise: { include: { category: true, subcategory: true } } },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { name: "asc" },
        });
        return res.json(workoutTypes);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar tipos de treino" });
    }
};
exports.getWorkoutTypes = getWorkoutTypes;
const addExerciseToWorkoutType = async (req, res) => {
    try {
        const { workoutTypeId, exerciseId, kg, reps, sets, restTime, observation, videoUrl, order } = req.body;
        const item = await database_1.prisma.workoutTypeExercise.create({
            data: { workoutTypeId, exerciseId, kg, reps, sets, restTime, observation, videoUrl, order: order || 0 },
            include: { exercise: true },
        });
        return res.status(201).json(item);
    }
    catch {
        return res.status(500).json({ error: "Erro ao adicionar exercício" });
    }
};
exports.addExerciseToWorkoutType = addExerciseToWorkoutType;
const updateWorkoutTypeExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { kg, reps, sets, restTime, observation, videoUrl, order } = req.body;
        const item = await database_1.prisma.workoutTypeExercise.update({
            where: { id },
            data: { kg, reps, sets, restTime, observation, videoUrl, order },
        });
        return res.json(item);
    }
    catch {
        return res.status(500).json({ error: "Erro ao atualizar exercício" });
    }
};
exports.updateWorkoutTypeExercise = updateWorkoutTypeExercise;
const removeExerciseFromWorkoutType = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.workoutTypeExercise.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch {
        return res.status(500).json({ error: "Erro ao remover exercício" });
    }
};
exports.removeExerciseFromWorkoutType = removeExerciseFromWorkoutType;
const deleteWorkoutType = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.workoutType.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch {
        return res.status(500).json({ error: "Erro ao deletar tipo de treino" });
    }
};
exports.deleteWorkoutType = deleteWorkoutType;
