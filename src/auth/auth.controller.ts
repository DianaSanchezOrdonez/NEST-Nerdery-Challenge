import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Param,
  Get,
  Patch,
  Response,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateInfoDto } from 'users/dto/update-user.dto';
import { InputInfoUserDto } from '../users/dto/input-user.dto';
import { AuthService } from './auth.service';
import { MessageDto } from './dto/message.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req, @Body() body: SigninUserDto) {
    return this.authService.signIn(req.user, body);
  }

  @Post('signup')
  async signup(@Body() body: InputInfoUserDto): Promise<MessageDto> {
    return this.authService.signUp(body);
  }

  @Post('confirm/:tokenEmail')
  confirm(@Param('tokenEmail') tokenEmail: string) {
    return this.authService.confirmEmail(tokenEmail);
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  protect(@Request() req) {
    //console.log(req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  @ApiBearerAuth('access_token')
  @Patch('signout')
  async logout(@Request() req): Promise<MessageDto> {
    //return await this.authService.signOut(req.user.id);
    return await {
      message: 'Successful logout',
    };
  }
}
