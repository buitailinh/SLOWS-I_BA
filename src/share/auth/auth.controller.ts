import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { Body, Controller, HttpCode, HttpStatus, Post, Get, Request, UseGuards, Req, Query, Res, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiOkResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiConsumes,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { AUTH_SWAGGER_RESPONSE } from './auth.constant';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/api/user/dto';
import { USER_SWAGGER_RESPONSE } from 'src/api/user/user.constant';
import { User } from 'src/api/user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgetPassword } from './dto/forgetPassword.dto';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @ApiCreatedResponse({ description: 'Sign up a account successfully' })
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.USER_FAIL)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }


  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.LOGIN_SUCCESS)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.LOGIN_FAIL)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.AUTH_OK)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.USER_FAIL)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @ApiQuery({
    name: 'email',
    type: 'string',
  })
  @ApiQuery({
    name: 'token',
    type: 'string',
  })
  @Get('verify-email')
  async verifyEmail(@Query('email') email: string, @Query('token') token: string) {
    return this.authService.verifyEmail(email, token);
  }



  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.AUTH_OK)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.USER_FAIL)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth() { };

  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.AUTH_OK)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.USER_FAIL)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @UseGuards(AuthGuard('google'))
  @Get('google/redirect')
  async loginGG(@Req() req, @Res() res) {
    const data = await this.authService.loginGG(req);
    // console.log(data);
    return res.redirect(`${process.env.FRONTEND_HOST}/loginGG?token=${JSON.stringify(data)}`);
  }

  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.AUTH_OK)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.USER_FAIL)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @ApiQuery({
    name: 'refreshToken',
    type: 'string',
  })
  @Post('refreshToken')
  async refreshToken(@Body() body) {
    const refresh = await this.authService.refreshToken(body.refreshToken);
    return refresh;
  }

  @ApiOkResponse({
    type: User,
    description: 'Update user successfully',
  })
  @ApiOkResponse(USER_SWAGGER_RESPONSE.UPDATE_REQUEST)
  @ApiNotFoundResponse(USER_SWAGGER_RESPONSE.USER_FAIL)
  @ApiUnauthorizedResponse(USER_SWAGGER_RESPONSE.UNAUTHORIZED_EXCEPTION)
  @ApiBadRequestResponse(USER_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiInternalServerErrorResponse(USER_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @ApiConsumes('multipart/form-data')
  @Post('setAvatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtRefreshAuthGuard)
  async uploadAvatar(@UploadedFile() file, @Request() req) {
    return this.authService.updateAvatar(req.user, file);
  }


  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.AUTH_OK)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.USER_FAIL)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  @ApiExcludeEndpoint()
  async logout(@Request() req) {
    await this.authService.logout(req.user);
    return 'logout successful';
  }


  @Post('/sendPhone')
  async sendPhone(@Body() body) {
    return this.authService.sendOTP(body.phone);
  }

  @Post('/addPhone')
  async addPhone(@Body() body, @Request() req) {
    await this.authService.addPhone(req.user, body.phone, body.OTP);
    return 'OK';
  }


  @ApiOkResponse({ description: 'send email forgot password successfully' })
  @ApiBadRequestResponse({ description: 'send email forgot password failed' })
  @ApiQuery({
    name: 'email',
    type: 'string',
  })
  @Get('send-forgotPassword')
  async sendEmailForgotPassword(@Query('email') email) {
    await this.authService.sendForgetPassword(email);

    return 'OK';
  }


  @ApiOkResponse({ description: 'send email forgot password successfully' })
  @ApiBadRequestResponse({ description: 'send email forgot password failed' })
  @ApiConsumes('multipart/form-data')
  @Post('reset-password')
  async resetPassword(@Body() forgetPassword: ForgetPassword, @Res() res) {
    try {
      await this.authService.forgetPassword(forgetPassword);
      const { email, newPassword } = forgetPassword;
      const result = await this.authService.login({ email, password: newPassword });
      return result;
    } catch (error) {
      throw new HttpException({
        message: 'OTP code is not correct',

      }, HttpStatus.BAD_REQUEST)
    }
  }

  @ApiOkResponse({
    description: 'information about user'
  })
  @ApiOkResponse(AUTH_SWAGGER_RESPONSE.AUTH_OK)
  @ApiNotFoundResponse(AUTH_SWAGGER_RESPONSE.USER_FAIL)
  @ApiBadRequestResponse(AUTH_SWAGGER_RESPONSE.BAD_REQUEST_EXCEPTION)
  @ApiInternalServerErrorResponse(AUTH_SWAGGER_RESPONSE.INTERNAL_SERVER_EXCEPTION)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  user(@Request() req) {
    // console.log(req);
    return req.user;
  }

}
