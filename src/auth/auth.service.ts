import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { SengridService } from '../common/services/sengrid.service';
import { generateHash } from '../common/helpers/generator-hash.helper';
import { TokenDto } from './dto/token.dto';
import { DataUserDto } from './dto/dataUser.dto';
import { PayloadUserDto } from './dto/payload.dto';
import { UserDto } from '../users/dto/user.dto';
import { ResponseUpdateInfoDto } from '../users/dto/responseUser.dto';
import { plainToClass } from 'class-transformer';
import { User } from '@prisma/client';
import { UpdateInfoDto } from '../users/dto/update-user.dto';
import { InputInfoUserDto } from '../users/dto/input-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private sengridService: SengridService,
  ) {}

  async checkPassword(
    passwordSent: string,
    passwordStored: string,
  ): Promise<boolean> {
    const IsPasswordMatching = await bcrypt.compare(
      passwordSent,
      passwordStored,
    );
    return IsPasswordMatching;
  }

  async validateUser(email: string, password: string): Promise<UserDto> {
    const userStored = await this.userService.findOne(email);
    if (!userStored) {
      throw new BadRequestException('Email or password is required');
    }
    const passwordChecked = await this.checkPassword(
      password,
      userStored.password,
    );

    if (userStored && passwordChecked) {
      return userStored;
    }

    throw new BadRequestException('Password or email is wrong');
  }

  async createToken(user): Promise<TokenDto> {
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      active: user.active,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(dataRegister: 
               ) {
    const confirmationCode = generateHash();
    await this.userService.createUser(dataRegister, confirmationCode);
    await this.sengridService.sendMailOfConfirmationCode(
      dataRegister.email,
      confirmationCode,
    );
    return {
      message: 'Check your email',
    };
  }

  async confirmEmail(tokenEmail) {
    const user = await this.userService.findUserWithToken(tokenEmail);
    if (!user) throw new NotFoundException('Not found User');
    await this.userService.updateUser(user.id, {
      active: true,
    });
    return this.createToken(user);
  }

  async signIn(user: User) {
    await this.userService.updateUser(user.id, {
      active: true,
    });
    return this.createToken(user);
  }

  async signOut(userId: number): Promise<UpdateInfoDto> {
    const userLogOut = await this.userService.signOut(userId);
    return plainToClass(ResponseUpdateInfoDto, userLogOut);
  }
}
