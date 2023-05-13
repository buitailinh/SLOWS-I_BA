import { AppConst } from './../common/app.const';
import { AppKey } from './../common/app.key';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { AppObject } from '../common/app.object';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class SendmailService {

  constructor(public mailerService: MailerService,
    private userService: UserService,
  ) { };

  async sendVerifiedEmail(email: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: `${email}`,
        from: 'linhbuitai@gmail.com',
        subject: 'verify email address your',
        text: 'abcdefghijklmnopqrstuvwxyz',
        html: `<html><h4>welcome to web shopp</h4> and link your account to:
         <a href=${process.env.FRONTEND_HOST}/confirm?email=${email}&token=${token}>confirm Email</a> </html> `,
      }).then(() => {
        console.log('Success sending email')
      }).catch(() => {
        console.log('Error sending email')
      });
      return `sendEmail to ${email}`;
    } catch (error) {
      return false;
    }
  }

  async sendForgetPassword(email: string, OTP: string) {
    this.mailerService.sendMail({
      to: `${email}`,
      from: 'linhbuitai@gmail.com',
      subject: 'Forget password your',
      text: `OTP: ${OTP}`,
    })
      .then((success) => {
        console.log(success);
      })
      .catch((error) => {
        console.log(error);
      });
  }

}
