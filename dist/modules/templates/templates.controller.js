"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.applyTemplateToWorkoutType = exports.addExerciseToTemplate = exports.getTemplates = exports.createTemplate = void 0;
const database_1 = require("../../config/database");
const createTemplate = async (req, res) => {
    try {
        const { name, description } = req.body;
        const isAdmin = req.user.role === "ADMIN";
        const template = await database_1.prisma.workoutTemplate.create({
            data: {
                name, description,
                isGlobal: isAdmin,
                trainerId: isAdmin ? null : req.user.id,
            },
        });
        return res.status(201).json(template);
    }
    catch {
        return res.status(500).json({ error: "Erro ao criar template" });
    }
};
exports.createTemplate = createTemplate;
const getTemplates = async (req, res) => {
    try {
        const templates = await database_1.prisma.workoutTemplate.findMany({
            where: {
                OR: [
                    { isGlobal: true },
                    { trainerId: req.user.id },
                ],
            },
            include: {
                exercises: {
                    include: { exercise: { include: { category: true, subcategory: true } } },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { name: "asc" },
        });
        return res.json(templates);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar templates" });
    }
};
exports.getTemplates = getTemplates;
const addExerciseToTemplate = async (req, res) => {
    try {
        const { templateId, exerciseId, kg, reps, sets, restTime, observation, videoUrl, order } = req.body;
        const item = await database_1.prisma.workoutTemplateExercise.create({
            data: { templateId, exerciseId, kg, reps, sets, restTime, observation, videoUrl, order: order || 0 },
            include: { exercise: true },
        });
        return res.status(201).json(item);
    }
    catch {
        return res.status(500).json({ error: "Erro ao adicionar exercício ao template" });
    }
};
exports.addExerciseToTemplate = addExerciseToTemplate;
// Copia template para um WorkoutType do personal (fica independente)
const applyTemplateToWorkoutType = async (req, res) => {
    try {
        const { templateId, name } = req.body;
        const template = await database_1.prisma.workoutTemplate.findUnique({
            where: { id: templateId },
            include: { exercises: true },
        });
        if (!template)
            return res.status(404).json({ error: "Template não encontrado" });
        const workoutType = await database_1.prisma.workoutType.create({
            data: {
                name: name || template.name,
                trainerId: req.user.id,
                exercises: {
                    create: template.exercises.map((e) => ({
                        exerciseId: e.exerciseId,
                        kg: e.kg,
                        reps: e.reps,
                        sets: e.sets,
                        restTime: e.restTime,
                        observation: e.observation,
                        videoUrl: e.videoUrl,
                        order: e.order,
                    })),
                },
            },
            include: {
                exercises: { include: { exercise: true } },
            },
        });
        return res.status(201).json(workoutType);
    }
    catch {
        return res.status(500).json({ error: "Erro ao aplicar template" });
    }
};
exports.applyTemplateToWorkoutType = applyTemplateToWorkoutType;
const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.workoutTemplate.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch {
        return res.status(500).json({ error: "Erro ao deletar template" });
    }
};
exports.deleteTemplate = deleteTemplate;
