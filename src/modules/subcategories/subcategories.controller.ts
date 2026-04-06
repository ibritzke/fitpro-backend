import { Request, Response } from "express";
import { prisma } from "../../config/database";

export const createSubcategory = async (req: any, res: Response) => {
  try {
    const { name, categoryId } = req.body;
    const subcategory = await prisma.subcategory.create({
      data: { name, categoryId, trainerId: req.user.id },
    });
    return res.status(201).json(subcategory);
  } catch {
    return res.status(500).json({ error: "Erro ao criar subcategoria" });
  }
};

export const getSubcategoriesByCategory = async (req: any, res: Response) => {
  try {
    const { categoryId } = req.params as { categoryId: string };
    const subcategories = await prisma.subcategory.findMany({
      where: { categoryId, trainerId: req.user.id },
      orderBy: { name: "asc" },
    });
    return res.json(subcategories);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar subcategorias" });
  }
};

export const deleteSubcategory = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.subcategory.delete({ where: { id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro ao deletar subcategoria" });
  }
};