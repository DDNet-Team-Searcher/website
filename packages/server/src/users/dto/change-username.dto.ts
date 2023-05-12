import { IsNotEmpty, IsString } from "class-validator";

export class ChangeUsernameDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
