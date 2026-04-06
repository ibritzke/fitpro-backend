"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubcategory = exports.getSubcategoriesByCategory = exports.createSubcategory = void 0;
const database_1 = require("../../config/database");
const createSubcategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        const subcategory = await database_1.prisma.subcategory.create({
            data: { name, categoryId, trainerId: req.user.id },
        });
        return res.status(201).json(subcategory);
    }
    catch {
        return res.status(500).json({ error: "Erro ao criar subcategoria" });
    }
};
exports.createSubcategory = createSubcategory;
const getSubcategoriesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const subcategories = await database_1.prisma.subcategory.findMany({
            where: { categoryId, trainerId: req.user.id },
            orderBy: { name: "asc" },
        });
        return res.json(subcategories);
    }
    catch {
        return res.status(500).json({ error: "Erro ao buscar subcategorias" });
    }
};
exports.getSubcategoriesByCategory = getSubcategoriesByCategory;
const deleteSubcategory = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.prisma.subcategory.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch {
        return res.status(500).json({ error: "Erro ao deletar subcategoria" });
    }
};
exports.deleteSubcategory = deleteSubcategory;
