/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';

export class ActiveBookDto {
  @Exclude()
  id: number;
  title: string;
  @Exclude()
  description: string;
  @Exclude()
  yearPublished: number;
  @Exclude()
  quantity: number;
  price: number;
  urlImage: string;
  active: boolean;
  @Exclude()
  categoryId: number;
  @Exclude()
  authorId: number;
}
