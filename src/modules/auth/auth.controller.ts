import crypto from "crypto";
import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken, verifyRefreshToken } from "../../utils/jwt";
import { Role, Status } from "@prisma/client";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Preencha todos os campos" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email já cadastrado" });

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name, email, password: hashed,
        role: Role.TRAINER,
        tenantId: crypto.randomUUID(),
        status: Status.ACTIVE,
      },
    });

    return res.status(201).json({
      id: user.id, name: user.name, email: user.email, role: user.role,
    });
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Preencha todos os campos" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    if (user.status === Status.INACTIVE)
      return res.status(403).json({ error: "Conta inativa" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(400).json({ error: "Senha incorreta" });

    /* Temporariamente removido para diagnosticar erro 500
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    */

    const token = generateToken({
      id: user.id, role: user.role, tenantId: user.tenantId,
    });

    return res.json({ token, role: user.role, name: user.name, id: user.id });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Erro interno", message: error.message });
  }
};

// Login do aluno por código
export const studentLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Código obrigatório" });

    const student = await prisma.student.findUnique({ where: { accessCode: code } });
    if (!student) return res.status(400).json({ error: "Código inválido" });

    if (student.status === Status.INACTIVE)
      return res.status(403).json({ error: "Conta inativa" });

    if (student.expiresAt && new Date(student.expiresAt) < new Date()) {
      return res.status(403).json({ error: "Acesso expirado. Fale com seu personal." });
    }

    await prisma.student.update({
      where: { id: student.id },
      data: { lastLogin: new Date() },
    });

    const token = generateToken({
      id: student.id, role: "STUDENT", trainerId: student.trainerId,
    });

    return res.json({ token, role: "STUDENT", name: student.name, id: student.id });
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    if (req.user.role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { id: req.user.id },
        select: { id: true, name: true, email: true, photoUrl: true, status: true, trainerId: true },
      });
      return res.json({ ...student, role: "STUDENT" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, photoUrl: true, logoUrl: true, status: true, lastLogin: true },
    });
    return res.json(user);
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: "Senha atual incorreta" });

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: "Refresh token obrigatório" });

    const decoded: any = verifyRefreshToken(refreshToken);

    const token = generateToken({
      id: decoded.id, role: decoded.role, tenantId: decoded.tenantId,
    });

    return res.json({ token });
  } catch {
    return res.status(401).json({ error: "Refresh token inválido ou expirado" });
  }
};