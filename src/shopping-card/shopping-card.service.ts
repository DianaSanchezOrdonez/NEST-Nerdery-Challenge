import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { ItemService } from '../item/item.service';

@Injectable()
export class ShoppingCardService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly itemsService: ItemService,
  ) {}

  async getAllPurchase() {
    return await this.prismaService.shoppingCard.findMany()
  }

  async getProductsPurchase(userId) {
    return await this.prismaService.shoppingCard.findMany({
      where: { userId },
    });
  }

  async createPurchase(userId: number, newStatus) {
    const itemsCard = await this.itemsService.getCardItemFromUser(userId);
    if (!itemsCard.length) throw new NotFoundException('Cart is empty');
    const total = itemsCard.reduce((acc, curr) => acc + curr.subtotal, 0);
    const shoppingCard = await this.prismaService.shoppingCard.create({
      data: {
        total: total,
        status: newStatus.status,
        userId,
      },
    });
    await this.itemsService.updateCardItemWithShoppingId(
      itemsCard,
      shoppingCard.id,
    );
    if (newStatus.status === 'PAID')
      await this.getShoppingPaid(shoppingCard.id);
    return shoppingCard;
  }

  async getShoppingPaid(idShopping: number) {
    const shoppingCard = await this.prismaService.shoppingCard.findFirst({
      where: {
        AND: [
          {
            id: idShopping,
          },
          { status: 'PAID' },
        ],
      },
    });
    await this.itemsService.reduceStockToBook(shoppingCard.id);
  }
}
