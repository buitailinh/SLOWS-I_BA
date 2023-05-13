import { SmsService } from './sms.service';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { OtpService } from './otp.service';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: (config) => ({
        ttl: 35000,
      }),
      // inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required()
      }),
    })
  ],
  providers: [OtpService, SmsService],
  exports: [OtpService, SmsService],
})
export class OtpModule { }
