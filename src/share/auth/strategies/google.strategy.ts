import { validate } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PassportSerializer, PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

config()

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `${process.env.BACKEND_HOST}/api/v1/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  };

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, displayName, emails } = profile;
    const user = {
      id,
      email: emails[0].value,
      name: displayName,
      accessToken,
    }
    done(null, user);
  }


}
