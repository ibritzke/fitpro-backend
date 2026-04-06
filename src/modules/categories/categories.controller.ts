import { Request, Response } from "express";
import { prisma } from "../../config/database";

export const createCategory = async (req: any, res: Response) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: { name, trainerId: req.user.id },
    });
    return res.status(201).json(category);
  } catch {
    return res.status(500).json({ error: "Erro ao criar categoria" });
  }
};

export const getCategories = async (req: any, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { trainerId: req.user.id },
      include: { subcategories: true },
      orderBy: { name: "asc" },
    });
    return res.json(categories);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar categorias" });
  }
};

export const deleteCategory = async (req: any, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await prisma.category.delete({ where: { id } });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Erro ao deletar categoria" });
  }
};