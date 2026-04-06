"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.getCategories = exports.createCategory = void 0;
const database_1 = require("../../config/database");
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await database_1.prisma.category.create({
            data: { name, trainerId: req.user.id },
        });
        return res.status(201).json(category);
    }
    catch {
        return res.status(500).json({ error: "Erro ao criar categoria" });
    }
};
exports.createCategory = createCategory;
const getCategories = async (req, res) => {
    try {
        const categories = await database_1.prisma.category.findMany({
            where: { trainerId: req.user.id },
            include: { subcategories: true },
            orderBy: { name: "asc" },
        });
        return res.json(categories);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar categorias" });
    }
};
exports.getCategories = getCategories;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.category.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch {
        return res.status(500).json({ error: "Erro ao deletar categoria" });
    }
};
exports.deleteCategory = deleteCategory;
