import { ObjectID } from 'typeorm';
import { google } from 'googleapis';
import { UserRepository } from 'src/api/user/user.repository';
import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/api/user/user.service';
import { User } from 'src/api/user/user.entity';
import { CreateUserDto } from 'src/api/user/dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './payloads/jwt-payload';
import { JWT_CONFIG } from '../../configs/constant.config';
import { ERROR } from '../common/error-code.const';
import { AppKey } from '../common/app.key';

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateConfirmEmailToken,
  verifyConfirmEmailToken
} from '../common/helper/jwt';
import { SendmailService } from '../sendmail/sendmail.service';
import { generateSlug } from '../common/helper/slug';
import { NotFoundError } from 'rxjs';
import { SmsService } from '../otp/sms.service';
import { ForgetPassword } from './dto/forgetPassword.dto';
import { AppObject } from '../common/app.object';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly sendMailService: SendmailService,
    private smsService: SmsService
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateToken(payload: any, refresh = true) {

    // const payload: JwtPayload = { email: user.email, id: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    if (refresh) {
      // const refresh_Token = generateRefreshToken(payload);
      const refresh_Token = this.jwtService.sign({ payload },
        {
          secret: process.env.REFRESH_TOKEN_SECRET_KEY,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRED_IN
        });
      console.log('test refresh_Token:', this.reverse(refresh_Token))
      const refreshToken = bcrypt.hashSync(
        this.reverse(refresh_Token),
        10,
      );
      // console.log('test2', payload)
      const user = await this.userService.getByUserId(payload.userId);
      await this.userService.userRepository.update(payload.userId, { ...user, refreshToken });

      return { accessToken, refreshToken: refresh_Token }
    }
    else {
      return accessToken
    }
  }


  async refreshToken(refreshToken: string) {
    try {
      const { payload } = verifyRefreshToken(refreshToken);
      const user = await this.getUserByRefresh(refreshToken, payload.userId);
      const payload1: JwtPayload = {
        userId: user._id,
        email: user.email,
        fullName: user.firstName + ' ' + user.lastName,
        avatar: user.avatar,
        role: user.role
      };
      const accessToken = await this.generateToken(payload1, false);
      console.log('accessToken new ', accessToken);
      return { accessToken }

    } catch (e) {
      console.error(e);
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

  }


  async getUserByRefresh(refreshToken, userId) {
    const user = await this.userService.getByUserId(userId);
    const is_equal = await bcrypt.compare(
      this.reverse(refreshToken),
      user.refreshToken
    );
    if (!is_equal) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    return user;
  }


  private reverse(s) {
    return s.split('').reverse().join('');
  }

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    // console.log(user);
    const token = generateConfirmEmailToken({ userId: user._id, email: user.email });
    await this.sendMailService.sendVerifiedEmail(user.email, token);
    // console.log(sendEmail);
    return {
      status: HttpStatus.OK,
      message: 'Đăng ký thành công, email send message to verification',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.getByEmail(email);
    if (!user)
      throw new HttpException(ERROR.USER_NOT_FOUND.MESSAGE, HttpStatus.BAD_REQUEST)
    const hashPassword = bcrypt.compareSync(password, user.password);
    if (!hashPassword) throw new BadRequestException(ERROR.PASSWORD_INCORRECT.MESSAGE);

    const payload: JwtPayload = {
      userId: user._id,
      email: user.email,
      fullName: user.firstName + ' ' + user.lastName,
      avatar: user.avatar,
      role: user.role,

    };
    const token = await this.generateToken(payload);
    return { token, status: true };
  }


  async verifyEmail(email: string, token: string) {

    const payload = verifyConfirmEmailToken(token);
    // console.log(decodedJwtAccessToken['payload']);
    // console.log(token);
    if (email === payload.email) {
      const user = await this.userService.getByEmail(email)
      if (!user) throw new NotFoundException({ message: AppKey.ERROR_MESSAGE.USER.ERR_NOT_EMAIL_EXIST });
      await this.userService.verifyEmail(email);
      return {
        status: HttpStatus.OK,
        message: 'verify email successfully',
      };
    }
    throw new BadRequestException('verify email failed');

  }



  async loginGG(data) {
    const { user } = data;
    // console.log('Test:', email, Types.ObjectId.isValid(email));

    const userFound = await this.userService.getByEmail(user.email);

    if (!userFound) {
      const name = user?.name.split(' ');
      const first_name = name[0];
      const last_name = name.slice(1).join(" ") || '';
      const fullnname = first_name + ' ' + last_name;
      // const slugname = generateSlug(name);
      const slugname = this.userService.generateUniqueUsername(fullnname);
      const userInforNew = {
        email: user.email,
        firstName: first_name,
        lastName: last_name,
        username: slugname,
        role: AppObject.USER_MODULE.ROLE.BASIC,
      }
      const userNew = await this.userRepository.save(userInforNew);
      const payload: JwtPayload = {
        userId: userNew._id,
        email: userNew.email,
        fullName: userNew.firstName + ' ' + userNew.lastName,
        role: AppObject.USER_MODULE.ROLE.BASIC,
        avatar: userNew.avatar
      };
      await this.userService.verifyEmail(userNew.email);

      const token = await this.generateToken(payload);
      return {
        token,
        accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRED_IN,
      }

    }
    const payload: JwtPayload = {
      userId: userFound._id,
      email: userFound.email,
      fullName: userFound.firstName + ' ' + userFound.lastName,
      avatar: userFound.avatar,
      role: userFound.role
    };
    // const jwtExpiresIn = JWT_CONFIG.expiresIn);
    // console.log(user);
    const token = await this.generateToken(payload);
    return {
      token,
      accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRED_IN,
    };
  }

  async updateAvatar(user, file) {
    console.log('user', user, file)
    const userFound = await this.userService.getByUserId(user._id);
    // console.log(userFound);
    await this.userService.updateAvatar(userFound, file);
    // console.log('avatar:', avatar);

    const userInfo = await this.userService.getByUserId(user._id);
    const payload: JwtPayload = {
      userId: userInfo._id,
      email: userInfo.email,
      fullName: userInfo.firstName + ' ' + userInfo.lastName,
      avatar: userInfo.avatar,
      role: userInfo.role
    };
    const token = await this.generateToken(payload);

    console.log('token', token);
    return {
      token,
      accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRED_IN,
      status: true
    };
  }

  async sendOTP(phone: string) {
    const phoneFound = await this.userService.getByPhone(phone);
    if (phoneFound) throw new HttpException('Number Phone is already', HttpStatus.BAD_REQUEST);
    const data = await this.smsService.initiatePhoneNumberVerification(phone);
    return data;
  }

  async addPhone(user: User, phone: string, OTP: string) {

    const result = await this.smsService.confirmPhonePhoneNumber(phone, OTP);
    if (!result) throw new HttpException('OTP code is incorrect', HttpStatus.BAD_REQUEST);
    return this.userService.addNumberPhone(user._id, phone);

  }

  async sendForgetPassword(email: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new NotFoundException({ message: AppKey.ERROR_MESSAGE.USER.ERR_NOT_EMAIL_EXIST });
    if (!user.phone) throw new BadRequestException('Phone number not exists');
    await this.smsService.initiatePhoneNumberVerification(user.phone);
    return {
      message: 'please check sms verificationCode',
      status: HttpStatus.PROCESSING,
    }
  }

  async forgetPassword(forgetPassword: ForgetPassword) {
    const { email, newPassword, OTP } = forgetPassword;
    // console.log(email)
    const user = await this.userService.getByEmail(email);
    // console.log(user)
    if (!user) throw new NotFoundException({ message: AppKey.ERROR_MESSAGE.USER.ERR_NOT_EMAIL_EXIST });

    const result = await this.smsService.confirmPhonePhoneNumber(user.phone, OTP);
    // console.log('abc')
    if (result) {
      const updatePassword = await this.userService.resertPassword(email, newPassword);
      if (updatePassword) {
        return 'update password successfully';
      }
      return 'update password failed';
    }
  }

  async logout(user) {
    const status = await this.userService.deleteRefreshToken(user._id);
    if (!status)
      throw new Error(`NOT log out ${user._id}`);

    return;
  }
}


