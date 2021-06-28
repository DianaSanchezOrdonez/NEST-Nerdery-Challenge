/* eslint-disable prettier/prettier */
import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
export class UpdateBookDto {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNumber()
  @IsOptional()
  readonly yearPublished?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly quantity: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly price: number;

  @IsString()
  @IsOptional()
  readonly urlImage: string;

  @IsString()
  @IsOptional()
  readonly authorName: string;

  @IsString()
  @IsOptional()
  readonly categoryName: string;
}
