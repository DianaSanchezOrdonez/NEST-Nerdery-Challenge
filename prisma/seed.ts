import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const password = hashSync('Password123', 10);

const users = [
  {
    username: 'diana98',
    email: 'dianaordonez1998@gmail.com',
    password,
  },
  {
    username: 'fran',
    email: 'lilatiravanttiarteaga@gmail.com',
    password,
  },
  {
    username: 'fernando',
    email: 'fernando@ravn.co',
    password,
  },
];

const prisma = new PrismaClient();

async function main() {
  for (const user of users) {
    const { username, email, password } = user;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        username,
        email,
        password,
        role: 'MANAGER',
        hashActivation: 'caracteresaleatorios',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
