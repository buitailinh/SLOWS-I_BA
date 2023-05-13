import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength } from "class-validator";
import { PatternLib } from "./../../utils/pattern.lib";

export class ForgetPassword {
    @ApiProperty({ type: 'string', required: true, description: 'email address' })
    @IsNotEmpty({ message: "Email iss not empty" })
    @IsEmail({ message: 'Invalid email format' })
    @Matches(PatternLib.email, {
        message: 'Invalid email format'
    })
    email: string;

    @ApiProperty({ type: 'string', required: true, description: ' password', minimum: 8, maximum: 30 })
    @IsNotEmpty({ message: "Password is not empty" })
    @Matches(PatternLib.password, { message: 'Invalid password format' })
    @Length(8, 30, { message: 'Min lenght must be 8' })
    @IsString()
    newPassword: string;


    @ApiProperty({ type: 'string', required: true, description: 'OTP key' })
    @IsNotEmpty({ message: "OTP is not empty" })
    @IsString()
    OTP: string;
}