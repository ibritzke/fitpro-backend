import { Response } from "express";
import { prisma } from "../../config/database";

export const uploadMyPhoto = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { photoUrl },
    });

    return res.json({ photoUrl });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao fazer upload" });
  }
};

export const uploadMyLogo = async (req: any, res: Response) => {
  try {
    if (req.user.role !== "TRAINER") {
      return res.status(403).json({ error: "Apenas personais podem ter logo" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    const logoUrl = `/uploads/${req.file.filename}`;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { logoUrl },
    });

    return res.json({ logoUrl });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao fazer upload da logo" });
  }
};

export const getTrainerPublicInfo = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const trainer = await prisma.user.findUnique({
      where: { id, role: "TRAINER" },
      select: { name: true, logoUrl: true },
    });

    if (!trainer) return res.status(404).json({ error: "Personal não encontrado" });

    return res.json(trainer);
  } catch {
    return res.status(500).json({ error: "Erro interno" });
  }
};