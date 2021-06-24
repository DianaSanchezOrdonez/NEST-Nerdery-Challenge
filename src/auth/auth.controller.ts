import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { InputInfoUserDto } from '../users/dto/input-user.dto';
import { AuthService } from './auth.service';
import { MessageDto } from './dto/message.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  async signup(@Body() body: InputInfoUserDto): Promise<MessageDto> {
    return this.authService.signUp(body);
  }

  @Post('confirm/:tokenEmail')
  confirm(@Param('tokenEmail') tokenEmail: string) {
    return this.authService.confirmEmail(tokenEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  protect(@Request() req) {
    return req.user;
  }
}
