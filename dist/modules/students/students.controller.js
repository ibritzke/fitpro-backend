"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleStudentStatus = exports.setStudentPin = exports.uploadStudentPhoto = exports.getStudentById = exports.getStudents = exports.createStudent = void 0;
const database_1 = require("../../config/database");
const client_1 = require("@prisma/client");
const createStudent = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name)
            return res.status(400).json({ error: "Nome é obrigatório" });
        const student = await database_1.prisma.student.create({
            data: { name, email: email || null, trainerId: req.user.id },
        });
        return res.status(201).json(student);
    }
    catch (error) {
        console.error("createStudent error:", error.message);
        return res.status(500).json({ error: "Erro ao criar aluno", detail: error.message });
    }
};
exports.createStudent = createStudent;
const getStudents = async (req, res) => {
    try {
        const students = await database_1.prisma.student.findMany({
            where: { trainerId: req.user.id },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                accessCode: true,
                photoUrl: true,
                createdAt: true,
            },
        });
        return res.json(students);
    }
    catch (error) {
        console.error("getStudents error:", error.message);
        return res.status(500).json({ error: "Erro ao buscar alunos", detail: error.message });
    }
};
exports.getStudents = getStudents;
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await database_1.prisma.student.findFirst({
            where: { id, trainerId: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                accessCode: true,
                photoUrl: true,
                createdAt: true,
            },
        });
        if (!student)
            return res.status(404).json({ error: "Aluno não encontrado" });
        return res.json(student);
    }
    catch (error) {
        console.error("getStudentById error:", error.message);
        return res.status(500).json({ error: "Erro ao buscar aluno", detail: error.message });
    }
};
exports.getStudentById = getStudentById;
const uploadStudentPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file)
            return res.status(400).json({ error: "Nenhuma imagem enviada" });
        const photoUrl = `/uploads/${req.file.filename}`;
        await database_1.prisma.student.update({ where: { id }, data: { photoUrl } });
        return res.json({ photoUrl });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao fazer upload" });
    }
};
exports.uploadStudentPhoto = uploadStudentPhoto;
// Novo: aluno define sua própria senha/pin de acesso
const setStudentPin = async (req, res) => {
    try {
        const { id } = req.params;
        const { pin } = req.body;
        if (!pin || pin.length < 4) {
            return res.status(400).json({ error: "PIN deve ter pelo menos 4 caracteres" });
        }
        await database_1.prisma.student.update({
            where: { id },
            data: { accessCode: pin },
        });
        return res.json({ success: true });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao definir PIN" });
    }
};
exports.setStudentPin = setStudentPin;
const toggleStudentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await database_1.prisma.student.findFirst({
            where: { id, trainerId: req.user.id },
        });
        if (!student)
            return res.status(404).json({ error: "Aluno não encontrado" });
        const updated = await database_1.prisma.student.update({
            where: { id },
            data: { status: student.status === client_1.Status.ACTIVE ? client_1.Status.INACTIVE : client_1.Status.ACTIVE },
        });
        return res.json({ status: updated.status });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar status" });
    }
};
exports.toggleStudentStatus = toggleStudentStatus;
