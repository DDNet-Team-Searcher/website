import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
