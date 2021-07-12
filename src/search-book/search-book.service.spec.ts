import { Test, TestingModule } from '@nestjs/testing';
import { CategoryModule } from '../category/category.module';
import { CategoryService } from '../category/category.service';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/services/prisma.service';
import { SearchBookService } from './search-book.service';

// const prisma = new PrismaClient();
let service: SearchBookService;
let prismaService: PrismaService;
let categoryService: CategoryService;
beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [CommonModule, CategoryModule],
    providers: [SearchBookService, CategoryService],
  }).compile();

  service = module.get<SearchBookService>(SearchBookService);
  categoryService = module.get<CategoryService>(CategoryService);
  prismaService = module.get<PrismaService>(PrismaService);

  await prismaService.category.createMany({
    data: [
      {
        name: 'politica peruana',
      },
      {
        name: 'fantasia',
      },
      {
        name: 'geografia',
      },
    ],
    skipDuplicates: true,
  });
  await prismaService.author.createMany({
    data: [
      {
        fullName: 'Julio Godoy',
      },
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
        authorId: 2,
        categoryId: 2,
        quantity: 10,
      },
      {
        title: 'El ultimo dictador',
        description: 'Describe la dictadura de Fujimori',
        yearPublished: 2020,
        price: 25.0,
        urlImage: 'https://image.com',
        authorId: 1,
        categoryId: 1,
        quantity: 15,
      },
    ],
    skipDuplicates: true,
  });
});

describe('search by categoryName', () => {
  const nameCategory1 = {
    search: 'fantasia',
  };
  const nameCategory2 = {
    search: 'infantil',
  };
  const nameCategory3 = {
    search: 'geografia',
  };
  it('should return a book', async () => {
    const res = await service.searchingByCategory(nameCategory1);
    expect(res[0].title).toEqual('Crepusculo');
  });
  it(`should return error if the category does not exist`, async () => {
    await expect(service.searchingByCategory(nameCategory2)).rejects.toThrow(
      `${nameCategory2.search} is not a valid category`,
    );
  });
  it(`should return error if the category does not have any book`, async () => {
    await expect(service.searchingByCategory(nameCategory3)).rejects.toThrow(
      `This ${nameCategory3.search} category does not have books`,
    );
  });
});

// Clean database
const clearDatabase = async function () {
  const tableNames = ['Category', 'Book', 'Author', 'Category'];
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
