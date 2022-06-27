import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserService } from '../user/user.service';

config();

/**
 * implements the jwt strategy, depending on the request path utilizes the include field of the request provided by the middleware and attaches the
 * team list data the user object
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const user = await this.userService.FindOneById(
      payload.id,
      request.include,
    );
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }

    return user;
  }
}
