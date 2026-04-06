"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExercise = exports.updateExercise = exports.getExercises = exports.createExercise = void 0;
const database_1 = require("../../config/database");
const createExercise = async (req, res) => {
    try {
        const { name, categoryId, subcategoryId } = req.body;
        const exercise = await database_1.prisma.exercise.create({
            data: { name, categoryId, subcategoryId: subcategoryId || null, trainerId: req.user.id },
            include: { category: true, subcategory: true },
        });
        return res.status(201).json(exercise);
    }
    catch {
        return res.status(500).json({ error: "Erro ao criar exercício" });
    }
};
exports.createExercise = createExercise;
const getExercises = async (req, res) => {
    try {
        const { categoryId } = req.query;
        const exercises = await database_1.prisma.exercise.findMany({
            where: {
                trainerId: req.user.id,
                ...(categoryId ? { categoryId } : {}),
            },
            include: { category: true, subcategory: true },
            orderBy: { name: "asc" },
        });
        return res.json(exercises);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar exercícios" });
    }
};
exports.getExercises = getExercises;
const updateExercise = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, categoryId, subcategoryId } = req.body;
        const exercise = await database_1.prisma.exercise.update({
            where: { id },
            data: { name, categoryId, subcategoryId: subcategoryId || null },
        });
        return res.json(exercise);
    }
    catch {
        return res.status(500).json({ error: "Erro ao atualizar exercício" });
    }
};
exports.updateExercise = updateExercise;
const deleteExercise = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.exercise.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch {
        return res.status(500).json({ error: "Erro ao deletar exercício" });
    }
};
exports.deleteExercise = deleteExercise;
