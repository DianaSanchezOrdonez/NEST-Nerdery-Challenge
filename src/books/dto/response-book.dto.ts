import { Exclude } from 'class-transformer';

export class ResponseBookDto {
  @Exclude()
  id: number;
  title: string;
  @Exclude()
  description: string;
  yearPublished: number;
  quantity: number;
  price: number;
  authorId: number;
  categoryId: number;
  @Exclude()
  urlImage: string;
  @Exclude()
  active: boolean;
}
