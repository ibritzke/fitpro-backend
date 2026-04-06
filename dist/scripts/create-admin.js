"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const hash_1 = require("../utils/hash");
async function main() {
    const existing = await database_1.prisma.user.findUnique({
        where: { email: "admin@fitpro.com" },
    });
    if (existing) {
        console.log("Admin já existe!");
        return;
    }
    const hashed = await (0, hash_1.hashPassword)("admin123");
    await database_1.prisma.user.create({
        data: {
            name: "Admin FitPro",
            email: "admin@fitpro.com",
            password: hashed,
            role: "ADMIN",
            tenantId: "fitpro-admin",
            status: "ACTIVE",
        },
    });
    console.log("✅ Admin criado com sucesso!");
    console.log("Email: admin@fitpro.com");
    console.log("Senha: admin123");
}
main().finally(() => database_1.prisma.$disconnect());
