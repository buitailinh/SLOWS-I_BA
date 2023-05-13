import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_REFRESH_CONFIG } from 'src/configs/constant.config';
import { Request } from 'express';
import { JwtPayload } from '../payloads/jwt-payload';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh_token') {
  constructor() {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_REFRESH_CONFIG.secret,
        passReqToCallback: true,
      }
    );
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
