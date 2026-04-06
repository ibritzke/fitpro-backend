"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const err = result.error;
            return res.status(400).json({
                error: "Dados inválidos",
                details: err.issues.map((e) => ({
                    field: e.path.join("."),
                    message: e.message,
                })),
            });
        }
        req.body = result.data;
        next();
    };
};
exports.validate = validate;
