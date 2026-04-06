"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentSchema = void 0;
const zod_1 = require("zod");
exports.createStudentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome muito curto"),
    email: zod_1.z.string().email("Email inválido").optional(),
});
