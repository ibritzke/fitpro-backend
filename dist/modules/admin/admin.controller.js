"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTrainerLogo = exports.toggleTrainerStatus = exports.getDashboard = exports.getTrainers = exports.createTrainer = void 0;
const database_1 = require("../../config/database");
const hash_1 = require("../../utils/hash");
const client_1 = require("@prisma/client");
const createTrainer = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Preencha todos os campos" });
        }
        const existing = await database_1.prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Email já cadastrado" });
        }
        const hashed = await (0, hash_1.hashPassword)(password);
        const trainer = await database_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: client_1.Role.TRAINER,
                tenantId: crypto.randomUUID(),
                status: client_1.Status.ACTIVE,
            },
        });
        return res.status(201).json({
            id: trainer.id,
            name: trainer.name,
            email: trainer.email,
            role: trainer.role,
            status: trainer.status,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar personal" });
    }
};
exports.createTrainer = createTrainer;
const getTrainers = async (req, res) => {
    try {
        const trainers = await database_1.prisma.user.findMany({
            where: { role: client_1.Role.TRAINER },
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                photoUrl: true,
                logoUrl: true,
                lastLogin: true,
                createdAt: true,
                _count: {
                    select: { students: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json(trainers);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar personais" });
    }
};
exports.getTrainers = getTrainers;
const getDashboard = async (req, res) => {
    try {
        const [totalTrainers, activeTrainers, inactiveTrainers, totalStudents] = await Promise.all([
            database_1.prisma.user.count({ where: { role: client_1.Role.TRAINER } }),
            database_1.prisma.user.count({ where: { role: client_1.Role.TRAINER, status: client_1.Status.ACTIVE } }),
            database_1.prisma.user.count({ where: { role: client_1.Role.TRAINER, status: client_1.Status.INACTIVE } }),
            database_1.prisma.student.count(),
        ]);
        const trainersWithStudents = await database_1.prisma.user.findMany({
            where: { role: client_1.Role.TRAINER },
            select: {
                id: true,
                name: true,
                status: true,
                lastLogin: true,
                _count: { select: { students: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json({
            summary: {
                totalTrainers,
                activeTrainers,
                inactiveTrainers,
                totalStudents,
            },
            trainers: trainersWithStudents,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar dashboard" });
    }
};
exports.getDashboard = getDashboard;
const toggleTrainerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const trainer = await database_1.prisma.user.findUnique({ where: { id } });
        if (!trainer) {
            return res.status(404).json({ error: "Personal não encontrado" });
        }
        const updated = await database_1.prisma.user.update({
            where: { id },
            data: {
                status: trainer.status === client_1.Status.ACTIVE ? client_1.Status.INACTIVE : client_1.Status.ACTIVE,
            },
        });
        return res.json({ status: updated.status });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar status" });
    }
};
exports.toggleTrainerStatus = toggleTrainerStatus;
const uploadTrainerLogo = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma imagem enviada" });
        }
        const logoUrl = `/uploads/${req.file.filename}`;
        await database_1.prisma.user.update({
            where: { id },
            data: { logoUrl },
        });
        return res.json({ logoUrl });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao fazer upload" });
    }
};
exports.uploadTrainerLogo = uploadTrainerLogo;
