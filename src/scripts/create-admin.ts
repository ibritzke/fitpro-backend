import { prisma } from "../config/database";
import { hashPassword } from "../utils/hash";

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "admin@fitpro.com" },
  });

  if (existing) {
    console.log("Admin já existe!");
    return;
  }

  const hashed = await hashPassword("admin123");

  await prisma.user.create({
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

main().finally(() => prisma.$disconnect());
