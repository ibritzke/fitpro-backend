"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMyPhoto = void 0;
const database_1 = require("../../config/database");
const uploadMyPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma imagem enviada" });
        }
        const photoUrl = `/uploads/${req.file.filename}`;
        await database_1.prisma.user.update({
            where: { id: req.user.id },
            data: { photoUrl },
        });
        return res.json({ photoUrl });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao fazer upload" });
    }
};
exports.uploadMyPhoto = uploadMyPhoto;
