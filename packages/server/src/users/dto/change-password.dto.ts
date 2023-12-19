import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDTO {
    @IsString()
    @IsNotEmpty()
    old: string;

    @IsString()
    @IsNotEmpty()
    new: string;
}
