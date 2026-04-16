import { Response, NextFunction } from "express";
import { prisma } from "../config/database";

// Garante que aluno só acessa os próprios dados
export const studentSelfOnly = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== "STUDENT") return next();

    const { studentId } = req.params as { studentId?: string };

    if (studentId && studentId !== req.user.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    next();
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
};

// Garante que trainer só acessa alunos que são seus
export const trainerOwnsStudent = async (req: any, res: Response, next: NextFunction) => {
  try {
    // Admin acessa tudo
    if (req.user.role === "ADMIN") return next();
    // Aluno já é validado pelo studentSelfOnly — passa direto
    if (req.user.role === "STUDENT") return next();

    const studentId = req.params.studentId || req.body.studentId;
    if (!studentId) return next();

    const student = await prisma.student.findFirst({
      where: { id: studentId, trainerId: req.user.id },
    });

    if (!student) return res.status(403).json({ error: "Aluno não pertence a você" });

    next();
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
};