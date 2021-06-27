import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from '../books/books.service';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../common/services/prisma.service';
import { ArrayCardItemsDto } from './dto/array-card-items.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemCardDto } from './dto/item-card.dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly booksService: BooksService,
  ) {}

  async createCardItem(
    userId: number,
    body: CreateItemDto,
  ): Promise<ItemCardDto> {
    const { count, bookId } = body;
    const book = await this.booksService.getActiveBook(bookId);
    if (book.quantity < count) {
      throw new BadRequestException(`The amount ${book.quantity} was exceeded`);
    }
    if (book.quantity === 0) {
      throw new BadRequestException(`Stock sold out: ${book.title}`);
    }
    const cardItem = await this.prismaService.cardItem.create({
      data: {
        count,
        subtotal: +book.price * count,
        bookId,
        userId,
      },
    });

    const cardWithBook = { ...book, ...cardItem };
    return plainToClass(ItemCardDto, cardWithBook);
  }

  async getCardItemFromUser(userId: number): Promise<ArrayCardItemsDto[]> {
    const cardItems = await this.prismaService.cardItem.findMany({
      where: {
        AND: [
          {
            userId: userId,
          },
          { shoppingId: null },
        ],
      },
    });
    return plainToClass(ArrayCardItemsDto, cardItems);
  }

  updateCardItemWithShoppingId(
    cardItems: ArrayCardItemsDto[],
    shoppingId: number,
  ) {
    return cardItems.map(
      async (item) =>
        await this.prismaService.cardItem.update({
          data: { shoppingId },
          where: { id: item.id },
        }),
    );
  }

  async reduceStockToBook(shoppingId: number) {
    const items = await this.prismaService.cardItem.findMany({
      where: { shoppingId },
    });

    return items.map(async (item) => {
      const book = await this.booksService.getActiveBook(item.bookId);
      await this.booksService.updateStockInBook(
        item.bookId,
        item.count,
        book.quantity,
      );
    });
  }
}
