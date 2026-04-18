require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('Runtime DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to database from .env!');
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Query successful, found users:', users.length);
    await prisma.$disconnect();
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
}

main();
