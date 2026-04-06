"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trainerOwnsStudent = exports.studentSelfOnly = void 0;
const database_1 = require("../config/database");
// Garante que aluno só acessa os próprios dados
const studentSelfOnly = async (req, res, next) => {
    try {
        if (req.user.role !== "STUDENT")
            return next();
        const { studentId } = req.params;
        if (studentId && studentId !== req.user.id) {
            return res.status(403).json({ error: "Acesso negado" });
        }
        next();
    }
    catch {
        return res.status(500).json({ error: "Erro interno" });
    }
};
exports.studentSelfOnly = studentSelfOnly;
// Garante que trainer só acessa alunos que são seus
const trainerOwnsStudent = async (req, res, next) => {
    try {
        if (req.user.role === "ADMIN")
            return next();
        const studentId = req.params.studentId || req.body.studentId;
        if (!studentId)
            return next();
        const student = await database_1.prisma.student.findFirst({
            where: { id: studentId, trainerId: req.user.id },
        });
        if (!student)
            return res.status(403).json({ error: "Aluno não pertence a você" });
        next();
    }
    catch {
        return res.status(500).json({ error: "Erro interno" });
    }
};
exports.trainerOwnsStudent = trainerOwnsStudent;
