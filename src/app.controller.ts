import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  UseFilters,
  Param,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CreateUserDto } from './users/dto/create-user.dto';
import { SigninUserDto } from './users/dto/signin-user.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req) {
    //console.log('body', req.user);
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto): Promise<any> {
    return this.authService.signUp(body);
  }

  @Post('confirm/:tokenEmail')
  confirm(@Param('tokenEmail') tokenEmail: string){
    return this.authService.confirmEmail(tokenEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protect(@Request() req) {
    // console.log('body', req)
    return req.user;
  }

  

  // @Get('/')
  // getHello() {
  //   return this.appService.getHello();
  // }
}
