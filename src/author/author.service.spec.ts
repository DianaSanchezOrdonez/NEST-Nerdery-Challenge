import { Test, TestingModule } from '@nestjs/testing';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/services/prisma.service';
import { AuthorService } from './author.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let service: AuthorService;
let prismaService: PrismaService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [CommonModule],
    providers: [AuthorService],
  }).compile();

  service = module.get<AuthorService>(AuthorService);
  prismaService = module.get<PrismaService>(PrismaService);
});

let idAuthor: number;

describe('Create author', () => {
  it('should return a new author', async () => {
    const res = await service.createAuthor({
      fullName: 'Isabel Allende',
    });
    idAuthor = res.id;
    expect(res).toHaveProperty('id');
    expect(res.fullName).toEqual('Isabel Allende');
  });
  it(`return author, upsert method, if it's repeat the full name`, async () => {
    const res = await service.createAuthor({
      fullName: 'Isabel Allende',
    });
    expect(res).toHaveProperty('id');
    expect(res.fullName).toEqual('Isabel Allende');
  });
});

describe('Get author', () => {
  it('should return an author', async () => {
    const res = await service.getAuthor(idAuthor.toString());
    expect(res).toHaveProperty('id');
    expect(res.fullName).toEqual('Isabel Allende');
  });
  it(`should return a not found author`, async () => {
    await expect(service.getAuthor('123')).rejects.toThrow(
      `There's not an author with this Id: 123`,
    );
  });
  it(`valid author id must be a number`, async () => {
    await expect(service.getAuthor('authorId')).rejects.toThrow(
      `authorId must be a number`,
    );
  });
});

// Clean database
const clearDatabase = async function () {
  const tableNames = ['Author', 'Category', 'Book', 'User'];
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
