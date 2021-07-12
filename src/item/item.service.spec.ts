import { Test, TestingModule } from '@nestjs/testing';
import { User, Book } from '@prisma/client';
import { AttachmentsService } from '../attachments/attachments.service';
import { BooksService } from '../books/books.service';
import { AttachmentsModule } from '../attachments/attachments.module';
import { BooksModule } from '../books/books.module';
import { CommonModule } from '../common/common.module';
import { PrismaService } from '../common/services/prisma.service';
import { ItemService } from './item.service';
import { UsersService } from '../users/users.service';

let service: ItemService;
let prismaService: PrismaService;
let user: User;
let book: Book;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [CommonModule, BooksModule, AttachmentsModule],
    providers: [
      ItemService,
      BooksService,
      AttachmentsService,
      UsersService,
      PrismaService,
    ],
  }).compile();

  service = module.get<ItemService>(ItemService);
  prismaService = module.get<PrismaService>(PrismaService);

  user = await prismaService.user.findFirst({
    where: { email: 'welcome@test.com' },
  });

  book = await prismaService.book.findFirst({
    where: { title: 'One Hundred Years of Solitude' },
  });
});

describe('Add book to cart', () => {
  it('book add to cart', async () => {
    const res = await service.createCardItem(user.id, {
      count: 2,
      bookId: book.id,
    });
    expect(res).toHaveProperty('subtotal');
    expect(res.subtotal).toEqual(39);
  });

  it('the count of book is more than quantity in stock', async () => {
    await expect(
      service.createCardItem(user.id, {
        count: 10,
        bookId: book.id,
      }),
    ).rejects.toThrow(`The amount ${book.quantity} was exceeded`);
  });

  it('get detail of cart', async () => {
    const res = await service.getCardItemFromUser(user.id);
    expect(res[0].count).toEqual(2);
    expect(res[0].subtotal).toEqual(39);
  });

  it('get error, not found user', async () => {
    await expect(service.getCardItemFromUser(123)).rejects.toThrow(
      'Not found user',
    );
  });
});

afterAll(async () => {
  await prismaService.cardItem.deleteMany();
});
