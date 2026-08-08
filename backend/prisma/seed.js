const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'rodneypopme@gmail.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'RodneyPop2020.'; // provided password

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, isAdmin: true },
    create: {
      email,
      password: hashed,
      name: 'Admin',
      isAdmin: true
    }
  });

  console.log('Admin user ensured:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
