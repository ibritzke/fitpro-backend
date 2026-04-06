import { Request, Response } from "express";
import { prisma } from "../../config/database";

export const saveHistory = async (req: any, res: Response) => {
  try {
    const { studentId, exerciseId, weight, setsCompleted, completed } = req.body;

    // Aluno só pode salvar o próprio histórico
    const resolvedStudentId = req.user.role === "STUDENT" ? req.user.id : studentId;

    const history = await prisma.history.create({
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
  } catch {
    return res.status(500).json({ error: "Erro ao salvar histórico" });
  }
};

export const getStudentHistory = async (req: any, res: Response) => {
  try {
    const { studentId } = req.params as { studentId: string };
    const { days } = req.query as { days?: string };

    // Aluno só vê o próprio histórico
    const resolvedId = req.user.role === "STUDENT" ? req.user.id : studentId;

    const daysBack = parseInt(days || "90");
    const since = new Date();
    since.setDate(since.getDate() - daysBack);

    const history = await prisma.history.findMany({
      where: { studentId: resolvedId, date: { gte: since } },
      orderBy: { date: "desc" },
    });
    return res.json(history);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar histórico" });
  }
};

// Aluno atualiza só o peso
export const updateWeight = async (req: any, res: Response) => {
  try {
    const { exerciseId, weight } = req.body;

    // Sempre usa o ID do aluno logado
    const studentId = req.user.role === "STUDENT" ? req.user.id : req.body.studentId;

    if (!studentId) return res.status(400).json({ error: "studentId obrigatório" });

    const history = await prisma.history.create({
      data: {
        studentId,
        exerciseId,
        weight,
        completed: false,
        date: new Date(),
      },
    });
    return res.status(201).json(history);
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar peso" });
  }
};

// Último peso registrado por exercício (para o app do aluno)
export const getLastWeights = async (req: any, res: Response) => {
  try {
    const studentId = req.user.role === "STUDENT" ? req.user.id : req.params.studentId;

    const history = await prisma.history.findMany({
      where: { studentId },
      orderBy: { date: "desc" },
      distinct: ["exerciseId"],
      select: { exerciseId: true, weight: true, date: true },
    });

    return res.json(history);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar pesos" });
  }
};