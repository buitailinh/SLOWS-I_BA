import { ApiProperty } from '@nestjs/swagger';
import { AppObject } from './../../../share/common/app.object';
import { IsAlphanumeric, IsDate, IsEmail, IsEnum, IsNotEmpty, IsString, Length, Matches, ValidationError } from 'class-validator';
import { parse } from 'querystring';
import { PatternLib } from 'src/share/utils/pattern.lib';
import { Transform, Type } from 'class-transformer';
import moment from 'moment';

export class CreateUserDto {

  @ApiProperty({ type: 'string', required: true, description: 'your firstname ', example: 'example', minLength: 2 })
  @IsNotEmpty({
    message: 'First Name is not empty',
  })
  @IsString()
  firstName: string;

  @ApiProperty({ type: 'string', required: true, description: 'your lastname ', example: 'example', minLength: 2 })
  @IsNotEmpty({
    message: 'Last Name is not empty',
  })
  @IsString()
  lastName: string;

  @ApiProperty({ type: 'string', required: true, description: 'Email address', example: 'example@example.com' })
  @IsNotEmpty({ message: "Email is not empty" })
  @IsEmail({ message: 'Invalid email format' })
  @Matches(PatternLib.email, {
    message: 'Invalid email format'
  })
  email: string;


  @ApiProperty({ required: true, description: 'account password', type: 'string', example: 'password', minLength: 8, maxLength: 30 })
  @IsNotEmpty({
    message: 'Password is not empty',
  })
  @Matches(PatternLib.password, {
    message: 'Password should have 1 upper case, lowcase letter along with a number and special characters'
  })
  @IsString()
  password?: string;

  @IsString()
  @IsEnum(AppObject.USER_MODULE.ROLE)
  role: string = AppObject.USER_MODULE.ROLE.CS;

  @ApiProperty({ required: true, description: ' phone number', type: 'string', example: '0123456789' })
  @IsNotEmpty({ message: "phone number is not empty" })
  @Matches(PatternLib.phone, { message: 'Invalid phone number format' })
  phone?: string;

  @ApiProperty({ required: false, description: 'your brithday', type: 'date', example: '2015-10-20' })
  // @Type(() => Date)
  // @Transform(brithday => moment(brithday).format('DD/MM/YY'))
  @Type(() => Date)
  @IsDate()
  brithday?: Date = new Date();
}
