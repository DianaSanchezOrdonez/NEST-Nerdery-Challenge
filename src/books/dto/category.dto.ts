import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
  @ApiProperty({ description: `The name of book's category` })
  @IsNotEmpty()
  @IsString()
  name: string;
}
