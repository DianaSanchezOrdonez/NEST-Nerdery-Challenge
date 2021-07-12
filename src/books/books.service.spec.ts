import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsService } from '../attachments/attachments.service';
import { AttachmentsModule } from '../attachments/attachments.module';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/services/prisma.service';
import { BooksService } from './books.service';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
let service: BooksService;
let prismaService: PrismaService;

let bookId: number;
let bookId2: number;
beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [CommonModule, AttachmentsModule],
    providers: [BooksService, AttachmentsService],
  }).compile();

  service = module.get<BooksService>(BooksService);
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
        name: 'politica peruana',
      },
      {
        name: 'fantasia',
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
  const book = await prismaService.book.findUnique({
    where: {
      title: 'Crepusculo',
    },
  });

  bookId = book.id;
  const book2 = await prismaService.book.findUnique({
    where: {
      title: 'El ultimo dictador',
    },
  });

  bookId2 = book2.id;
});

// Test create a book
describe('Create a book', () => {
  it('should return a book', async () => {
    const bookCreated = await service.createBook({
      title: 'La Odisea',
      description:
        'La odisea es un poema épico que narra las aventuras de Odiseo',
      yearPublished: 2020,
      price: 25.0,
      urlImage: 'https://image.com',
      authorName: 'Homero',
      categoryName: 'clasico universal',
      quantity: 15,
    });

    expect(bookCreated).toHaveProperty('id');
    expect(bookCreated.title).toEqual('la odisea');
    expect(bookCreated.active).toEqual(true);
  });
  it('should return a error if the book already exists', async () => {
    const bookToCreate = {
      title: 'La Odisea',
      description: 'description',
      yearPublished: 2020,
      price: 25.0,
      urlImage: 'https://image.com',
      authorName: 'other',
      categoryName: 'other',
      quantity: 15,
    };
    await expect(service.createBook(bookToCreate)).rejects.toThrow(
      `The book ${bookToCreate.title} has already exist`,
    );
  });
});

// Test Get all books from the manager
describe('show all the book active and inactive', () => {
  const pagination = {
    page: 1,
    perPage: 3,
  };
  it('should return the quantity of all the active and inactive books', async () => {
    const allBooks = await service.getBooks(pagination);
    expect(allBooks).toHaveLength(3);
  });
});

// Get one book active or inactive
describe('show all the book active and inactive', () => {
  it('should return the number of books created', async () => {
    const allBooks = await service.findOne(bookId);
    expect(allBooks.title).toBe('Crepusculo');
  });
});

// Update book
describe('update a book', () => {
  const updatedNewInfo = {
    title: 'Las mil y un noches',
    categoryName: 'fantasía',
    authorName: 'Desconocido',
  };

  const updatedExistingCategoryandAuthor = {
    title: 'Iliada',
    categoryName: 'clasico universal',
    authorName: 'Homero',
  };

  it('should return an error if the book does not exist', async () => {
    await expect(service.updateBook(100, updatedNewInfo)).rejects.toThrow(
      `There's not an book with this Id: 100`,
    );
  });

  it('should update a book with new category and author', async () => {
    const bookToUpdate = await service.updateBook(3, updatedNewInfo);
    expect(bookToUpdate.title).toBe('Las mil y un noches');
    expect(bookToUpdate).toHaveProperty('categoryId');
    expect(bookToUpdate).toHaveProperty('authorId');
  });

  it('should update a book with existing category and existing author', async () => {
    const bookToUpdate = await service.updateBook(
      3,
      updatedExistingCategoryandAuthor,
    );
    expect(bookToUpdate.title).toBe('Iliada');
    expect(bookToUpdate).toHaveProperty('categoryId');
    expect(bookToUpdate).toHaveProperty('authorId');
  });
});

// Disable book
describe('disable book', () => {
  const state = {
    active: false,
  };
  it('should return an error if the books does not exist', async () => {
    const state = {
      active: false,
    };
    await expect(service.disableBook(100, state)).rejects.toThrowError(
      `There's not an book with this Id: 100`,
    );
  });

  it('should return the book disabled', async () => {
    const bookInactive = await service.disableBook(bookId, state);
    expect(bookInactive).toHaveProperty('title');
    expect(bookInactive).toEqual({
      active: false,
      title: 'Crepusculo',
    });
  });
});

// Get only active  books
describe('show active books', () => {
  const pagination = {
    page: 1,
    perPage: 3,
  };
  it('should return the number of books active', async () => {
    const allBooks = await service.getActiveBooks(pagination);
    expect(allBooks).toHaveLength(2);
  });
});

// Get one active book
describe('get an active book', () => {
  it('should return an error if the book is inactive', async () => {
    await expect(service.getOneBookActive(1)).rejects.toThrow(
      `There's not an book with this Id: 1`,
    );
  });
  it('should return an active book', async () => {
    const activeBook = await service.getOneBookActive(bookId2);
    expect(activeBook.title).toBe('El ultimo dictador');
  });
});

// Test like

describe('process like and unlikes', () => {
  const jsonLike = {
    like: true,
  };

  const jsonDislike = {
    like: false,
  };

  it('should return an error if the post does not exist', async () => {
    await expect(service.processLikes(100, 1, jsonLike)).rejects.toThrowError(
      `There's not any book with this Id: 100`,
    );
  });

  // Like
  it('should return 1 if we give a like to a post that does not have any like', async () => {
    const postToLike = await service.processLikes(2, 1, jsonLike);
    expect(postToLike).toEqual(1);
  });

  it('should return error if we give a like to a post with like', async () => {
    await expect(service.processLikes(2, 1, jsonLike)).rejects.toThrowError(
      'Cant like a post that has a like',
    );
  });

  // Dislike
  it('should return 0 if we give a dislike to a post that has 1 like', async () => {
    const likes = await service.findOne(2);
    const postToDislike = await service.processLikes(2, 1, jsonDislike);
    expect(postToDislike).toEqual(0);
  });
  // it('should return error if we give a dislike to a post that was not previously liked for user', async () => {
  //   await expect(service.processLikes(2, 1, jsonLike)).rejects.toThrowError(
  //     'Cant dislike a post that havent been liked',
  //   );
  // });
});

// Delete book

describe('delete a book', () => {
  it('should return an error if the books does not exist', async () => {
    await expect(service.deleteBook(100)).rejects.toThrowError(
      `There's not an book with this Id: 100`,
    );
  });

  it('should return the book deleted', async () => {
    const bookToDelete = await service.deleteBook(bookId);

    expect(bookToDelete.title).toBe('Crepusculo');
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
    await prismaService.$disconnect();
  }
};

afterAll(async () => {
  await clearDatabase();
});
