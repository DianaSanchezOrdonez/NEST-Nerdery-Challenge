import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { PrismaService } from '../common/services/prisma.service';
import { plainToClass } from 'class-transformer';
import { UpdateInfoDto } from './dto/update-user.dto';
import { ResponseUpdateInfoDto } from './dto/responseUser.dto';

import { User } from '@prisma/client';

import { InputInfoUserDto } from './dto/input-user.dto';
import { generatePassword } from '../common/helpers/generator-hash.helper';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getUsers() {
    return await this.prismaService.user.findMany();
  }

  async createUser(
    createUserDto: InputInfoUserDto,
    tokenEmail: string,
  ): Promise<UserDto> {
    const { username, email } = createUserDto;
    const user = await this.uniqueEmailOrUsername(username, email);
    if (user) throw new BadRequestException('Username or email already exists');
    const passwordHashed = await generatePassword(createUserDto.password);
    return await this.prismaService.user.create({
      data: {
        username,
        email,
        password: passwordHashed,
        firstName: '',
        lastName: '',
        role: 'CLIENT',
        hashActivation: tokenEmail,
      },
    });
  }

  async uniqueEmailOrUsername(username: string, email: string) {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
  }

  async findOneId(id: number): Promise<UserDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('Not found user');
    return user;
  }

  async findOne(email: string): Promise<UserDto> {
    return await this.prismaService.user.findFirst({
      where: { email },
    });
  }

  async findUserWithToken(emailToken: string): Promise<User> {
    return await this.prismaService.user.findFirst({
      where: { hashActivation: emailToken },
    });
  }

  async updateUser(
    userId: number,
    input: UpdateInfoDto,
  ): Promise<UpdateInfoDto> {
    const userUpdated = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...input,
      },
    });
    return plainToClass(ResponseUpdateInfoDto, userUpdated);
  }

  async updateRole(idUser: string, newRole): Promise<UserDto> {
    const user = await this.prismaService.user.update({
      where: { id: Number(idUser) },
      data: { role: newRole.role },
    });
    return plainToClass(UserDto, user);
  }

  async validateActiveUser(idUser: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: idUser },
    });
    return user.active;
  }
}
