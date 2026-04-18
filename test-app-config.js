const { prisma } = require('./src/config/database');

async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log('Connection through app config successful:', user ? 'Found user' : 'No users found');
  } catch (error) {
    console.error('Connection through app config FAILED:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
