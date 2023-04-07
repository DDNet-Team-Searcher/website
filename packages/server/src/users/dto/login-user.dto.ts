import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
