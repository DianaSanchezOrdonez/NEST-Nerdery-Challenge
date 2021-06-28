/* eslint-disable prettier/prettier */
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
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
  readonly price: number
  
  @IsString()
  readonly urlImage?: string;

  @IsPositive()
  @IsNumber()
  readonly quantity: number;

  @IsNotEmpty()
  @IsString()
  readonly authorName: string;

  @IsNotEmpty()
  @IsString()
  readonly categoryName: string;
}
