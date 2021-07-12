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
import { InputInfoUserDto } from '../users/dto/input-user.dto';
import { AuthService } from './auth.service';
import { MessageDto } from './dto/message.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req) {
    return this.authService.signIn(req.user);
  }

  @Post('signup')
  async signup(@Body() body: InputInfoUserDto): Promise<void> {
    await this.authService.signUp(body);
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
  @ApiBearerAuth('access_token')
  @Patch('signout')
  async logout(@Request() req): Promise<void> {
    await this.authService.signOut(req.user.id);
  }
}
