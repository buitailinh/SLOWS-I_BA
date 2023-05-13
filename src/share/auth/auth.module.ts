import { RefreshJwtStrategy } from './strategies/rf-jwt.strategy';

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/configs/constant.config';
import { UserModule } from 'src/api/user/user.module';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { DatabaseModule } from 'src/configs/database/database.module';
import { SendmailModule } from '../sendmail/sendmail.module';
import { OtpModule } from '../otp/otp.module';
@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    SendmailModule,
    OtpModule,
    JwtModule.register({
      secret: JWT_CONFIG.secret,
      signOptions: {
        expiresIn: JWT_CONFIG.expiresIn,
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, RefreshJwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
