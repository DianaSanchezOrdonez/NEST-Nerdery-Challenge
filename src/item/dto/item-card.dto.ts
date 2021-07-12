import { Decimal } from '@prisma/client/runtime';
import { Exclude } from 'class-transformer';

export class ItemCardDto {
  id: number;
  title: string;
  @Exclude()
  description: string;
  @Exclude()
  yearPublished: number;
  @Exclude()
  quantity: number;
  count: number;
  price: number;
  @Exclude()
  urlImage: string;
  @Exclude()
  active: boolean;
  @Exclude()
  authorId: number;
  subtotal: number;
  dateCreated: Date;
  @Exclude()
  userId: number;
  @Exclude()
  bookId: number;
  @Exclude()
  shoppingId: number;
}
