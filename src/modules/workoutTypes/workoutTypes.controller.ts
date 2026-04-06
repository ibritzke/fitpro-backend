import { Request, Response } from "express";
import { prisma } from "../../config/database";

export const createWorkoutType = async (req: any, res: Response) => {
  try {
    const { name } = req.body;
    const workoutType = await prisma.workoutType.create({
      data: { name, trainerId: req.user.id },
    });
    return res.status(201).json(workoutType);
  } catch {
    return res.status(500).json({ error: "Erro ao criar tipo de treino" });
  }
};

export const getWorkoutTypes = async (req: any, res: Response) => {
  try {
    const workoutTypes = await prisma.workoutType.findMany({
      where: { trainerId: req.user.id },
      include: {
        exercises: {
          include: { exercise: { include: { category: true, subcategory: true } } },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return res.json(workoutTypes);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar tipos de treino" });
  }
};

export const addExerciseToWorkoutType = async (req: any, res: Response) => {
  try {
    const { workoutTypeId, exerciseId, kg, reps, sets, restTime, observation, videoUrl, order } = req.body;
    const item = await prisma.workoutTypeExercise.create({
      data: { workoutTypeId, exerciseId, kg, reps, sets, restTime, observation, videoUrl, order: order || 0 },
      include: { exercise: true },
    });
    return res.status(201).json(item);
  } catch {
    return res.status(500).json({ error: "Erro ao adicionar exercício" });
  }
};

export const updateWorkoutTypeExercise = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { kg, reps, sets, restTime, observation, videoUrl, order } = req.body;
    const item = await prisma.workoutTypeExercise.update({
      where: { id },
      data: { kg, reps, sets, restTime, observation, videoUrl, order },
    });
    return res.json(item);
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar exercício" });
  }
};

export const removeExerciseFromWorkoutType = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.workoutTypeExercise.delete({ where: { id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro ao remover exercício" });
  }
};

export const deleteWorkoutType = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.workoutType.delete({ where: { id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro ao deletar tipo de treino" });
  }
};