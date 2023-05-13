import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator';
import { PatternLib } from 'src/share/utils/pattern.lib';

export class LoginDto {
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
}
