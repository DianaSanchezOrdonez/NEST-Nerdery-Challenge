import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/services/prisma.service';
import { CategoryService } from './category.service';

const prisma = new PrismaClient();
let service: CategoryService;
let prismaService: PrismaService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [CommonModule],
    providers: [CategoryService],
  }).compile();

  service = module.get<CategoryService>(CategoryService);
  prismaService = module.get<PrismaService>(PrismaService);
});

let idCategory: number;

describe('Create category', () => {
  it('should return a new category', async () => {
    const res = await service.createCategory({
      name: 'fantasia',
    });
    idCategory = res.id;
    expect(res).toHaveProperty('id');
    expect(res.name).toEqual('fantasia');
  });
  it(`return author, upsert method, if it's repeat the  category`, async () => {
    await expect(
      service.createCategory({
        name: 'fantasia',
      }),
    ).rejects.toThrowError('The category has already exist');
  });
});

describe('get category', () => {
  it('should return an category', async () => {
    const res = await service.getCategory(idCategory.toString());
    expect(res).toHaveProperty('id');
    expect(res.name).toEqual('fantasia');
  });
  it(`should return a not found category`, async () => {
    await expect(service.getCategory('123')).rejects.toThrow(
      `There is not a category with this id`,
    );
  });
});

describe('show all the book active and inactive', () => {
  it('should return the quantity of all the active and inactive books', async () => {
    const allBooks = await service.getCategories();
    expect(allBooks).toHaveLength(1);
  });
});

describe('show the book with an specific name', () => {
  it('should return a categorey objtec', async () => {
    const allBooks = await service.getCategoryByName('fantasia');
    expect(allBooks).toHaveProperty('id');
  });

  it('should return eror if the category does not exist', async () => {
    await expect(service.getCategoryByName('infantil')).rejects.toThrow(
      `infantil is not a valid category`,
    );
  });
});
// Clean database
const clearDatabase = async function () {
  const tableNames = ['Category'];
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
    await prisma.$disconnect();
  }
};

afterAll(async () => {
  await clearDatabase();
});
