import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { hashPassword } from "../../utils/hash";
import { Role, Status } from "@prisma/client";

export const createTrainer = async (req: any, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashed = await hashPassword(password);

    const trainer = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
        role: Role.TRAINER,
        tenantId: crypto.randomUUID(),
        status: Status.ACTIVE,
      },
    });

    return res.status(201).json({
      id: trainer.id,
      name: trainer.name,
      email: trainer.email,
      role: trainer.role,
      status: trainer.status,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar personal" });
  }
};

export const getTrainers = async (req: Request, res: Response) => {
  try {
    const trainers = await prisma.user.findMany({
      where: { role: Role.TRAINER },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
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
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar personais" });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [totalTrainers, activeTrainers, inactiveTrainers, totalStudents] =
      await Promise.all([
        prisma.user.count({ where: { role: Role.TRAINER } }),
        prisma.user.count({ where: { role: Role.TRAINER, status: Status.ACTIVE } }),
        prisma.user.count({ where: { role: Role.TRAINER, status: Status.INACTIVE } }),
        prisma.student.count(),
      ]);

    const trainersWithStudents = await prisma.user.findMany({
      where: { role: Role.TRAINER },
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
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar dashboard" });
  }
};

export const toggleTrainerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    const trainer = await prisma.user.findUnique({ where: { id } });
    if (!trainer) {
      return res.status(404).json({ error: "Personal não encontrado" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        status: trainer.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE,
      },
    });

    return res.json({ status: updated.status });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar status" });
  }
};
export const updateTrainer = async (req: any, res: Response) => {
  try {
    if (req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: "Sem permissão" });
    }

    const { id } = req.params as { id: string };
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Nome e email são obrigatórios" });
    }

    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id },
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Email já em uso" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { name, email, phone },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
      },
    });

    return res.json(updated);
  } catch {
    return res.status(500).json({ error: "Erro ao editar personal" });
  }
};

export const updateTrainerPassword = async (req: any, res: Response) => {
  try {
    if (req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: "Sem permissão" });
    }

    const { id } = req.params as { id: string };
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Senha inválida" });
    }

    const hashed = await hashPassword(password);

    await prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro ao atualizar senha" });
  }
};


export const uploadTrainerLogo = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    const logoUrl = `/uploads/${req.file.filename}`;

    await prisma.user.update({
      where: { id },
      data: { logoUrl },
    });

    return res.json({ logoUrl });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao fazer upload" });
  }
};

export const deleteTrainer = async (req: any, res: Response) => {
  try {
    if (req.user.role !== Role.ADMIN) {
      return res.status(403).json({ error: "Sem permissão" });
    }

    const { id } = req.params as { id: string };

    const userToErase = await prisma.user.findUnique({
      where: { id },
      include: {
        students: { select: { id: true } }
      }
    });

    if (!userToErase) return res.status(404).json({ error: "Personal não encontrado" });

    // for each student, delete their workoutDays, history
    const studentIds = userToErase.students.map((s: any) => s.id);
    if (studentIds.length > 0) {
      await prisma.studentWorkoutDay.deleteMany({ where: { studentId: { in: studentIds } } });
      await prisma.history.deleteMany({ where: { studentId: { in: studentIds } } });
    }

    await prisma.workoutTypeExercise.deleteMany({ where: { workoutType: { trainerId: id } } });
    await prisma.studentWorkoutDay.deleteMany({ where: { workoutType: { trainerId: id } } });
    await prisma.workoutTemplateExercise.deleteMany({ where: { template: { trainerId: id } } });

    await prisma.workoutTemplate.deleteMany({ where: { trainerId: id } });
    await prisma.workoutType.deleteMany({ where: { trainerId: id } });
    await prisma.exercise.deleteMany({ where: { trainerId: id } });
    await prisma.subcategory.deleteMany({ where: { trainerId: id } });
    await prisma.category.deleteMany({ where: { trainerId: id } });
    await prisma.student.deleteMany({ where: { trainerId: id } });

    await prisma.user.delete({
      where: { id },
    });

    return res.json({ success: true, message: "Personal excluído com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir personal" });
  }
};
