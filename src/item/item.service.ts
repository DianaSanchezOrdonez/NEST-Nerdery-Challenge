import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardItem, Prisma } from '@prisma/client';
import { BooksService } from '../books/books.service';
import { plainToClass } from 'class-transformer';
import { PrismaService } from '../common/services/prisma.service';
import { ArrayCardItemsDto } from './dto/array-card-items.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemCardDto } from './dto/item-card.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly booksService: BooksService,
    private readonly userService: UsersService,
  ) {}

  async createCardItem(
    userId: number,
    body: CreateItemDto,
  ): Promise<ItemCardDto> {
    const { count, bookId } = body;
    const book = await this.booksService.getOneBookActive(bookId);
    if (book.quantity === 0) {
      throw new BadRequestException(`Stock sold out: ${book.title}`);
    }
    if (book.quantity < count) {
      throw new BadRequestException(`The amount ${book.quantity} was exceeded`);
    }
    const cardItem = await this.prismaService.cardItem.create({
      data: {
        count,
        subtotal: +book.price * count,
        bookId,
        userId,
      },
    });

    return plainToClass(ItemCardDto, { ...book, ...cardItem });
  }

  async getCardItemFromUser(userId: number): Promise<ArrayCardItemsDto[]> {
    const user = await this.userService.findOneId(userId);
    const cardItems = await this.prismaService.cardItem.findMany({
      where: {
        AND: [
          {
            userId: user.id,
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
      const book = await this.booksService.getOneBookActive(item.bookId);
      await this.booksService.updateStockInBook(
        item.bookId,
        item.count,
        book.quantity,
      );
    });
  }
}
