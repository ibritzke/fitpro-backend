import { Request, Response } from "express";
import { prisma } from "../../config/database";

export const assignWorkoutDay = async (req: any, res: Response) => {
  try {
    const { studentId, workoutTypeId, dayOfWeek } = req.body;

    const student = await prisma.student.findFirst({
      where: { id: studentId, trainerId: req.user.id },
    });
    if (!student) return res.status(403).json({ error: "Aluno não encontrado" });

    const existing = await prisma.studentWorkoutDay.findFirst({
      where: { studentId, dayOfWeek },
    });

    let result;
    if (existing) {
      result = await prisma.studentWorkoutDay.update({
        where: { id: existing.id },
        data: { workoutTypeId },
        include: { workoutType: { include: { exercises: { include: { exercise: true } } } } },
      });
    } else {
      result = await prisma.studentWorkoutDay.create({
        data: { studentId, workoutTypeId, dayOfWeek },
        include: { workoutType: { include: { exercises: { include: { exercise: true } } } } },
      });
    }

    return res.status(201).json(result);
  } catch {
    return res.status(500).json({ error: "Erro ao atribuir treino" });
  }
};

export const getStudentSchedule = async (req: any, res: Response) => {
  try {
    const { studentId } = req.params as { studentId: string };
    const schedule = await prisma.studentWorkoutDay.findMany({
      where: { studentId },
      include: {
        workoutType: {
          include: {
            exercises: {
              include: { exercise: { include: { category: true, subcategory: true } } },
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { dayOfWeek: "asc" },
    });
    return res.json(schedule);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar agenda" });
  }
};

export const getTodayWorkout = async (req: any, res: Response) => {
  try {
    const { studentId } = req.params as { studentId: string };
    const today = new Date().getDay();

    const workout = await prisma.studentWorkoutDay.findFirst({
      where: { studentId, dayOfWeek: today },
      include: {
        workoutType: {
          include: {
            exercises: {
              include: { exercise: { include: { category: true, subcategory: true } } },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!workout) return res.status(404).json({ message: "Nenhum treino para hoje" });
    return res.json(workout);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar treino do dia" });
  }
};

export const removeWorkoutDay = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.studentWorkoutDay.delete({ where: { id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro ao remover treino" });
  }
};