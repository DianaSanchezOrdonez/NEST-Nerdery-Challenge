/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';

export class DetailBookDto {
  @Exclude()
  id: number;
  title: string;
  description: string;
  yearPublished: number;
  quantity: number;
  price: number;
  urlImage: string;
  active: boolean;
  categoryId: number;
  authorId: number;
  likesQuantity: number;
}
