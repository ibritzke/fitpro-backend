"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.changePassword = exports.getMe = exports.studentLogin = exports.login = exports.register = void 0;
const database_1 = require("../../config/database");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
const client_1 = require("@prisma/client");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: "Preencha todos os campos" });
        const existing = await database_1.prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ error: "Email já cadastrado" });
        const hashed = await (0, hash_1.hashPassword)(password);
        const user = await database_1.prisma.user.create({
            data: {
                name, email, password: hashed,
                role: client_1.Role.TRAINER,
                tenantId: crypto.randomUUID(),
                status: client_1.Status.ACTIVE,
            },
        });
        return res.status(201).json({
            id: user.id, name: user.name, email: user.email, role: user.role,
        });
    }
    catch {
        return res.status(500).json({ error: "Erro interno" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Preencha todos os campos" });
        const user = await database_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ error: "Usuário não encontrado" });
        if (user.status === client_1.Status.INACTIVE)
            return res.status(403).json({ error: "Conta inativa" });
        const valid = await (0, hash_1.comparePassword)(password, user.password);
        if (!valid)
            return res.status(400).json({ error: "Senha incorreta" });
        // Atualiza lastLogin
        await database_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const token = (0, jwt_1.generateToken)({
            id: user.id, role: user.role, tenantId: user.tenantId,
        });
        return res.json({ token, role: user.role, name: user.name, id: user.id });
    }
    catch {
        return res.status(500).json({ error: "Erro interno" });
    }
};
exports.login = login;
// Login do aluno por código
const studentLogin = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code)
            return res.status(400).json({ error: "Código obrigatório" });
        const student = await database_1.prisma.student.findUnique({ where: { accessCode: code } });
        if (!student)
            return res.status(400).json({ error: "Código inválido" });
        if (student.status === client_1.Status.INACTIVE)
            return res.status(403).json({ error: "Conta inativa" });
        await database_1.prisma.student.update({
            where: { id: student.id },
            data: { lastLogin: new Date() },
        });
        const token = (0, jwt_1.generateToken)({
            id: student.id, role: "STUDENT", trainerId: student.trainerId,
        });
        return res.json({ token, role: "STUDENT", name: student.name, id: student.id });
    }
    catch {
        return res.status(500).json({ error: "Erro interno" });
    }
};
exports.studentLogin = studentLogin;
const getMe = async (req, res) => {
    try {
        if (req.user.role === "STUDENT") {
            const student = await database_1.prisma.student.findUnique({
                where: { id: req.user.id },
                select: { id: true, name: true, email: true, photoUrl: true, status: true, trainerId: true },
            });
            return res.json({ ...student, role: "STUDENT" });
        }
        const user = await database_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, photoUrl: true, logoUrl: true, status: true, lastLogin: true },
        });
        return res.json(user);
    }
    catch {
        return res.status(500).json({ error: "Erro interno" });
    }
};
exports.getMe = getMe;
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await database_1.prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user)
            return res.status(404).json({ error: "Usuário não encontrado" });
        const valid = await (0, hash_1.comparePassword)(currentPassword, user.password);
        if (!valid)
            return res.status(400).json({ error: "Senha atual incorreta" });
        const hashed = await (0, hash_1.hashPassword)(newPassword);
        await database_1.prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
        return res.json({ success: true });
    }
    catch {
        return res.status(500).json({ error: "Erro interno" });
    }
};
exports.changePassword = changePassword;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(401).json({ error: "Refresh token obrigatório" });
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const token = (0, jwt_1.generateToken)({
            id: decoded.id, role: decoded.role, tenantId: decoded.tenantId,
        });
        return res.json({ token });
    }
    catch {
        return res.status(401).json({ error: "Refresh token inválido ou expirado" });
    }
};
exports.refreshToken = refreshToken;
