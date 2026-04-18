import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DATABASE_URL || "";
const maskedUrl = dbUrl.replace(/:[^@:]+@/, ":****@");
console.log(`🔌 Initializing Prisma with URL: ${maskedUrl}`);

export const prisma = new PrismaClient({
  log: ["error", "warn"],
});
