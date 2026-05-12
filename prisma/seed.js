require('dotenv').config();

const { PrismaClient, Role } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD belum ada di .env'
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('⚠️ Super admin sudah ada');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('✅ Super admin berhasil dibuat');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });