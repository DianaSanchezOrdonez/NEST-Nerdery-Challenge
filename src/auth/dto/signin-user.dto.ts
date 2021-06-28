import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
