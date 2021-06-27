/* eslint-disable prettier/prettier */
import { CreateAuthorDto } from 'author/dto/create-author.dto';
import { Category } from '@prisma/client';
import { Author } from '@prisma/client';
import { Exclude } from 'class-transformer';

import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNumber()
  readonly yearPublished?: number;

  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsString()
  readonly urlImage: string;
  // readonly authorId: number;
  @IsNotEmpty()
  @IsString()
  readonly authorName: string;

  @IsNotEmpty()
  @IsString()
  readonly categoryName: string;
}
