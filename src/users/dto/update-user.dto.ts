/* eslint-disable prettier/prettier */
import { IsOptional } from 'class-validator';

export class UpdateInfoDto {
  @IsOptional()
  firstName?: string;
  @IsOptional()
  lastName?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  password?: string;
  @IsOptional()
  username?: string;
  @IsOptional()
  active?: boolean;
}
