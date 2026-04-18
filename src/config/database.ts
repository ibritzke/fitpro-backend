import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const dbUrl = process.env.DATABASE_URL || "";
const logPath = path.join(process.cwd(), "debug_db.log");

const maskedUrl = dbUrl.replace(/:[^@:]+@/, ":****@");
const logInfo = `[${new Date().toISOString()}] Initializing Prisma.\nRuntime URL: ${maskedUrl}\n`;

fs.appendFileSync(logPath, logInfo);

export const prisma = new PrismaClient();