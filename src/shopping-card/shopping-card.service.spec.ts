import { Test, TestingModule } from '@nestjs/testing';
import { Book, User } from '@prisma/client';
import { ItemService } from '../item/item.service';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/services/prisma.service';
import { ShoppingCardService } from './shopping-card.service';
import { BooksService } from '../books/books.service';
import { UsersService } from '../users/users.service';
import { AttachmentsService } from '../attachments/attachments.service';
import { ItemModule } from '../item/item.module';
import { AttachmentsModule } from '../attachments/attachments.module';
import { BooksModule } from '../books/books.module';

let service: ShoppingCardService;
let itemService: ItemService;
let prismaService: PrismaService;

let user: User;
let book: Book;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [CommonModule, ItemModule, BooksModule, AttachmentsModule],
    providers: [
      ShoppingCardService,
      ItemService,
      BooksService,
      AttachmentsService,
      UsersService,
    ],
  }).compile();

  service = module.get<ShoppingCardService>(ShoppingCardService);
  itemService = module.get<ItemService>(ItemService);
  prismaService = module.get<PrismaService>(PrismaService);

  await prismaService.user.create({
    data: {
      username: 'Pblito23',
      password: 'Prueba123',
      email: 'pablo@gmail.com',
      hashActivation: 'prueba',
    },
  });
  await prismaService.category.createMany({
    data: [
      {
        name: 'fantasia',
      },
    ],
    skipDuplicates: true,
  });
  await prismaService.author.createMany({
    data: [
      {
        fullName: 'Stephanie Meyer',
      },
    ],
    skipDuplicates: true,
  });
  await prismaService.book.createMany({
    data: [
      {
        title: 'Crepusculo',
        description: 'Historia de amor ente jovenes vampiros',
        yearPublished: 2010,
        price: 30.0,
        urlImage: 'https://image.com',
        authorId: 1,
        categoryId: 1,
        quantity: 10,
      },
    ],
    skipDuplicates: true,
  });
  book = await prismaService.book.findUnique({
    where: {
      title: 'Crepusculo',
    },
  });

  user = await prismaService.user.findFirst({
    where: { email: 'pablo@gmail.com' },
  });
});

describe('Create Purcharse', () => {
  it('Cart empty', async () => {
    await expect(
      service.createPurchase(user.id, {
        status: 'PAID',
      }),
    ).rejects.toThrow('Cart is empty');
  });

  it('Success create purcharse', async () => {
    const cart = await itemService.createCardItem(user.id, {
      count: 1,
      bookId: book.id,
    });
    const res = await service.createPurchase(user.id, {
      status: 'PAID',
    });

    expect(res).toHaveProperty('total');
    expect(cart.id).not.toBeNull();
  });
});

describe('Get Paid Purcharse', () => {
  it('Return paid purcharse', async () => {
    const res = await service.getProductsPurchase(user.id);
    expect(res).toHaveLength(1);
  });
  it('Return paid purcharse', async () => {
    await itemService.createCardItem(user.id, {
      count: 1,
      bookId: book.id,
    });
    await service.createPurchase(user.id, {
      status: 'PENDING',
    });
    const res = await service.getProductsPurchase(user.id);
    expect(res).toHaveLength(2);
  });
});

afterAll(async () => {
  await prismaService.cardItem.deleteMany();
  await prismaService.shoppingCard.deleteMany();
});

// Clean database
const clearDatabase = async function () {
  const tableNames = [
    'CardItem',
    'ShoppingCard',
    'Book',
    'User',
    'Category',
    'Author',
  ];
  try {
    for (const tableName of tableNames) {
      await prismaService.$queryRaw(`DELETE FROM "${tableName}";`);
      if (!['Store'].includes(tableName)) {
        await prismaService.$queryRaw(
          `ALTER SEQUENCE "${tableName}_id_seq" RESTART WITH 1;`,
        );
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } finally {
    await prismaService.$disconnect();
  }
};

afterAll(async () => {
  await clearDatabase();
});
