"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWorkoutDay = exports.getTodayWorkout = exports.getStudentSchedule = exports.assignWorkoutDay = void 0;
const database_1 = require("../../config/database");
const assignWorkoutDay = async (req, res) => {
    try {
        const { studentId, workoutTypeId, dayOfWeek } = req.body;
        const student = await database_1.prisma.student.findFirst({
            where: { id: studentId, trainerId: req.user.id },
        });
        if (!student)
            return res.status(403).json({ error: "Aluno não encontrado" });
        const existing = await database_1.prisma.studentWorkoutDay.findFirst({
            where: { studentId, dayOfWeek },
        });
        let result;
        if (existing) {
            result = await database_1.prisma.studentWorkoutDay.update({
                where: { id: existing.id },
                data: { workoutTypeId },
                include: { workoutType: { include: { exercises: { include: { exercise: true } } } } },
            });
        }
        else {
            result = await database_1.prisma.studentWorkoutDay.create({
                data: { studentId, workoutTypeId, dayOfWeek },
                include: { workoutType: { include: { exercises: { include: { exercise: true } } } } },
            });
        }
        return res.status(201).json(result);
    }
    catch {
        return res.status(500).json({ error: "Erro ao atribuir treino" });
    }
};
exports.assignWorkoutDay = assignWorkoutDay;
const getStudentSchedule = async (req, res) => {
    try {
        const { studentId } = req.params;
        const schedule = await database_1.prisma.studentWorkoutDay.findMany({
            where: { studentId },
            include: {
                workoutType: {
                    include: {
                        exercises: {
                            include: { exercise: { include: { category: true, subcategory: true } } },
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
            orderBy: { dayOfWeek: "asc" },
        });
        return res.json(schedule);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar agenda" });
    }
};
exports.getStudentSchedule = getStudentSchedule;
const getTodayWorkout = async (req, res) => {
    try {
        const { studentId } = req.params;
        const today = new Date().getDay();
        const workout = await database_1.prisma.studentWorkoutDay.findFirst({
            where: { studentId, dayOfWeek: today },
            include: {
                workoutType: {
                    include: {
                        exercises: {
                            include: { exercise: { include: { category: true, subcategory: true } } },
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
        });
        if (!workout)
            return res.status(404).json({ message: "Nenhum treino para hoje" });
        return res.json(workout);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar treino do dia" });
    }
};
exports.getTodayWorkout = getTodayWorkout;
const removeWorkoutDay = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.studentWorkoutDay.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch {
        return res.status(500).json({ error: "Erro ao remover treino" });
    }
};
exports.removeWorkoutDay = removeWorkoutDay;
