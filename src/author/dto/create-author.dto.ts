import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ description: `The name of book's author` })
  @IsNotEmpty()
  @IsString()
  fullName: string;
}
