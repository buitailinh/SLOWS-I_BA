import { PatternLib } from 'src/share/utils/pattern.lib';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ type: 'string', required: true, description: ' email address', example: 'example@example.com' })
  @IsNotEmpty({ message: "Email iss not empty" })
  @IsEmail({ message: 'Invalid email format' })
  @Matches(PatternLib.email, {
    message: 'Invalid email format'
  })
  email: string;

  @ApiProperty({ required: true, description: 'account password', type: 'string', example: 'password', minLength: 8, maxLength: 30 })
  @IsNotEmpty({ message: "Password is not empty" })
  @Matches(PatternLib.password, { message: 'Invalid password format' })
  @Length(8, 30, { message: 'Min lenght must be 8' })
  @IsString()
  password: string;


  @ApiProperty({ type: 'string', required: true, description: 'your firstname ', example: 'example', minLength: 2 })
  @IsNotEmpty({ message: "Firstname is not empty" })
  @Matches(PatternLib.name, { message: 'Invalid  firstname format' })
  @IsString()
  @MinLength(2, {
    message: ' Firstname must be should 2',
  })
  firstName: string;

  @ApiProperty({ type: 'string', required: true, description: 'your lastname ', example: 'example', minLength: 2 })
  @IsNotEmpty({ message: "Lastname is not empty" })
  @Matches(PatternLib.name, { message: 'Invalid  lastname format' })
  @IsString()
  @MinLength(2, {
    message: ' Lastname must be should 2',
  })
  lastName: string;

  @ApiProperty({ required: true, description: ' phone number', type: 'string', example: '0123456789' })
  @IsNotEmpty({ message: "phone number is not empty" })
  @Matches(PatternLib.phone, { message: 'Invalid phone number format' })
  phone: string;

  @ApiProperty({ required: false, description: 'your brithday', type: 'date', example: '2015-10-20' })
  // @Type(() => Date)
  // @Transform(brithday => moment(brithday).format('DD/MM/YY'))
  @Type(() => Date)
  @IsDate()
  brithday?: Date = new Date();
}
