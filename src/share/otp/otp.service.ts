// import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as otpGenerator from 'otp-generator';
import { Cache } from 'cache-manager';

@Injectable()
export class OtpService {
  private readonly OTP_LENGTH;
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    // private config: ConfigService,
  ) {
    this.OTP_LENGTH = '8';
  }

  async generateOtp(email: string) {
    const otp = otpGenerator.generate(this.OTP_LENGTH, {
      digits: true,
      alphabets: false,
      specialChars: false,
      upperCase: false,
    });
    await this.cacheManager.set(otp, email, { ttl: 180 });
    return otp;
  }

  async checkOtp(email: string, otp: string,) {
    const savedEmail = await this.cacheManager.get(otp);
    const result = !!savedEmail && savedEmail === email;
    if (result) {
      await this.cacheManager.del(otp);
    }
    return result;
  }
}
