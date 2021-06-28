import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { PayloadUserDto } from './dto/payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.TOKEN_KEY,
    });
  }
  async validate(payload) {
    const userActive = await this.userService.validateActiveUser(payload.id);
    //console.log('userActive', userActive);
    if (!userActive) {
      throw new UnauthorizedException();
    }

    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    };
  }
}
