"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastWeights = exports.updateWeight = exports.getStudentHistory = exports.saveHistory = void 0;
const database_1 = require("../../config/database");
const saveHistory = async (req, res) => {
    try {
        const { studentId, exerciseId, weight, setsCompleted, completed } = req.body;
        // Aluno só pode salvar o próprio histórico
        const resolvedStudentId = req.user.role === "STUDENT" ? req.user.id : studentId;
        const history = await database_1.prisma.history.create({
            data: {
                studentId: resolvedStudentId,
                exerciseId,
                weight,
                setsCompleted,
                completed,
                date: new Date(),
            },
        });
        return res.status(201).json(history);
    }
    catch {
        return res.status(500).json({ error: "Erro ao salvar histórico" });
    }
};
exports.saveHistory = saveHistory;
const getStudentHistory = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { days } = req.query;
        // Aluno só vê o próprio histórico
        const resolvedId = req.user.role === "STUDENT" ? req.user.id : studentId;
        const daysBack = parseInt(days || "90");
        const since = new Date();
        since.setDate(since.getDate() - daysBack);
        const history = await database_1.prisma.history.findMany({
            where: { studentId: resolvedId, date: { gte: since } },
            orderBy: { date: "desc" },
        });
        return res.json(history);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar histórico" });
    }
};
exports.getStudentHistory = getStudentHistory;
// Aluno atualiza só o peso
const updateWeight = async (req, res) => {
    try {
        const { exerciseId, weight } = req.body;
        // Sempre usa o ID do aluno logado
        const studentId = req.user.role === "STUDENT" ? req.user.id : req.body.studentId;
        if (!studentId)
            return res.status(400).json({ error: "studentId obrigatório" });
        const history = await database_1.prisma.history.create({
            data: {
                studentId,
                exerciseId,
                weight,
                completed: false,
                date: new Date(),
            },
        });
        return res.status(201).json(history);
    }
    catch {
        return res.status(500).json({ error: "Erro ao atualizar peso" });
    }
};
exports.updateWeight = updateWeight;
// Último peso registrado por exercício (para o app do aluno)
const getLastWeights = async (req, res) => {
    try {
        const studentId = req.user.role === "STUDENT" ? req.user.id : req.params.studentId;
        const history = await database_1.prisma.history.findMany({
            where: { studentId },
            orderBy: { date: "desc" },
            distinct: ["exerciseId"],
            select: { exerciseId: true, weight: true, date: true },
        });
        return res.json(history);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar pesos" });
    }
};
exports.getLastWeights = getLastWeights;
