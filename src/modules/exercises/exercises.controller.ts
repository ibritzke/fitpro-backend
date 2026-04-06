import { Request, Response } from "express";
import { prisma } from "../../config/database";

export const createExercise = async (req: any, res: Response) => {
  try {
    const { name, categoryId, subcategoryId } = req.body;
    const exercise = await prisma.exercise.create({
      data: { name, categoryId, subcategoryId: subcategoryId || null, trainerId: req.user.id },
      include: { category: true, subcategory: true },
    });
    return res.status(201).json(exercise);
  } catch {
    return res.status(500).json({ error: "Erro ao criar exercício" });
  }
};

export const getExercises = async (req: any, res: Response) => {
  try {
    const { categoryId } = req.query as { categoryId?: string };
    const exercises = await prisma.exercise.findMany({
      where: {
        trainerId: req.user.id,
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: true, subcategory: true },
      orderBy: { name: "asc" },
    });
    return res.json(exercises);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar exercícios" });
  }
};

export const updateExercise = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name, categoryId, subcategoryId } = req.body;
    const exercise = await prisma.exercise.update({
      where: { id },
      data: { name, categoryId, subcategoryId: subcategoryId || null },
    });
    return res.json(exercise);
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar exercício" });
  }
};

export const deleteExercise = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.exercise.delete({ where: { id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro ao deletar exercício" });
  }
};