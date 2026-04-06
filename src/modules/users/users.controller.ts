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