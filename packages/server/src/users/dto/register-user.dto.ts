import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
