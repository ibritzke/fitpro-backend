import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { getPagination, paginatedResponse } from "../../utils/pagination";
import { Status } from "@prisma/client";

export const createStudent = async (req: any, res: Response) => {
  try {
    const { name, email, phone } = req.body;
    if (!name) return res.status(400).json({ error: "Nome é obrigatório" });

    const student = await prisma.student.create({
      data: { name, email: email || null, phone: phone || null, trainerId: req.user.id },
    });
    return res.status(201).json(student);
  } catch (error: any) {
    console.error("createStudent error:", error.message);
    return res.status(500).json({ error: "Erro ao criar aluno", detail: error.message });
  }
};

export const getStudents = async (req: any, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      where: { trainerId: req.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        accessCode: true,
        expiresAt: true,
        photoUrl: true,
        createdAt: true,
      },
    });
    return res.json(students);
  } catch (error: any) {
    console.error("getStudents error:", error.message);
    return res.status(500).json({ error: "Erro ao buscar alunos", detail: error.message });
  }
};

export const getStudentById = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const student = await prisma.student.findFirst({
      where: { id, trainerId: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        accessCode: true,
        expiresAt: true,
        photoUrl: true,
        createdAt: true,
      },
    });
    if (!student) return res.status(404).json({ error: "Aluno não encontrado" });
    return res.json(student);
  } catch (error: any) {
    console.error("getStudentById error:", error.message);
    return res.status(500).json({ error: "Erro ao buscar aluno", detail: error.message });
  }
};

export const uploadStudentPhoto = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    if (!req.file) return res.status(400).json({ error: "Nenhuma imagem enviada" });
    const photoUrl = `/uploads/${req.file.filename}`;
    await prisma.student.update({ where: { id }, data: { photoUrl } });
    return res.json({ photoUrl });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao fazer upload" });
  }
};

// Novo: aluno define sua própria senha/pin de acesso
export const setStudentPin = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { pin } = req.body;

    if (!pin || pin.length < 4) {
      return res.status(400).json({ error: "PIN deve ter pelo menos 4 caracteres" });
    }

    await prisma.student.update({
      where: { id },
      data: { accessCode: pin },
    });

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao definir PIN" });
  }
};

export const updateStudent = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name, email, phone, expiresAt } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const student = await prisma.student.findFirst({
      where: {
        id,
        trainerId: req.user.id,
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: { 
        name, 
        email, 
        phone,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      },
    });

    return res.json(updated);
  } catch {
    return res.status(500).json({ error: "Erro ao editar aluno" });
  }
};

export const renewStudent = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { days } = req.body;

    if (!days || typeof days !== "number") {
      return res.status(400).json({ error: "Dias para renovação inválidos" });
    }

    const student = await prisma.student.findFirst({
      where: { id, trainerId: req.user.id },
    });

    if (!student) return res.status(404).json({ error: "Aluno não encontrado" });

    // Determine the baseline date to add days to. 
    // If it's already expired or null, use today. If it's still valid in the future, add to the existing expiresAt.
    const baseline = (student.expiresAt && new Date(student.expiresAt) > new Date()) 
      ? new Date(student.expiresAt) 
      : new Date();

    baseline.setDate(baseline.getDate() + days);

    const updated = await prisma.student.update({
      where: { id },
      data: { expiresAt: baseline },
    });

    return res.json({ success: true, expiresAt: updated.expiresAt });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao renovar aluno" });
  }
};

export const toggleStudentStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const student = await prisma.student.findFirst({
      where: { id, trainerId: req.user.id },
    });
    if (!student) return res.status(404).json({ error: "Aluno não encontrado" });

    const updated = await prisma.student.update({
      where: { id },
      data: { status: student.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE },
    });
    return res.json({ status: updated.status });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao atualizar status" });
  }
};

export const deleteStudent = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const student = await prisma.student.findFirst({
      where: { id, trainerId: req.user.id },
    });

    if (!student) return res.status(404).json({ error: "Aluno não encontrado" });

    await prisma.studentWorkoutDay.deleteMany({ where: { studentId: id } });
    await prisma.history.deleteMany({ where: { studentId: id } });

    await prisma.student.delete({
      where: { id },
    });

    return res.json({ success: true, message: "Aluno excluído com sucesso" });
  } catch (error: any) {
    return res.status(500).json({ error: "Erro ao excluir aluno" });
  }
};
