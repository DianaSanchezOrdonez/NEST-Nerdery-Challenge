import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

const password = hashSync('Welcome123', 10);

const user = [
  {
    username: 'welcome',
    email: 'welcome@test.com',
    password,
  },
];

const author = [
  {
    fullName: 'Gabriel García Márquez',
  },
];

const category = [
  {
    name: 'magic realism',
  },
];

const book = [
  {
    title: 'One Hundred Years of Solitude',
    description: 'Many years later, as he faced the firing squad',
    yearPublished: 1967,
    price: 19.5,
    urlImage: '',
    authorName: 'Gabriel García Márquez',
    categoryName: 'magic realism',
    quantity: 3,
  },
];

const prisma = new PrismaClient();

async function main() {
  const { username, email } = user[0];
  const { fullName } = author[0];
  const { name } = category[0];
  const { title, description, yearPublished, price } = book[0];
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
  const authorCreated = await prisma.author.upsert({
    where: { fullName },
    update: {},
    create: {
      fullName,
    },
  });
  const categoryCreated = await prisma.category.upsert({
    where: { name },
    update: {},
    create: {
      name,
    },
  });
  await prisma.book.upsert({
    where: { title },
    update: {},
    create: {
      title,
      description,
      yearPublished,
      price,
      urlImage: '',
      authorId: authorCreated.id,
      categoryId: categoryCreated.id,
      quantity: 3,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
