/* eslint-disable prettier/prettier */
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
export class UpdateBookDto {
  @IsOptional()
  readonly title: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  readonly yearPublished?: number;

  @IsOptional()
  readonly quantity: number;

  @IsOptional()
  readonly price: number;

  @IsOptional()
  readonly urlImage: string;

  @IsOptional()
  readonly authorName: string;

  @IsOptional()
  readonly categoryName: string;
}
