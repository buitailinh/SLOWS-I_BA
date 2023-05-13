import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_CONFIG } from 'src/configs/constant.config';
import { JwtPayload } from '../payloads/jwt-payload';
import { UserRepository } from 'src/api/user/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access_token') {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONFIG.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const _id = payload.userId;
    const user = await this.userRepository.findOne(_id);
    if (!user) throw new UnauthorizedException();

    return { ...user };
  }
}
