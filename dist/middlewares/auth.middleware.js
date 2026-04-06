"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não encontrado" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch {
        return res.status(401).json({ error: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
