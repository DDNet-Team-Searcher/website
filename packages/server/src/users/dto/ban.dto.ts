import { IsNotEmpty, IsString } from 'class-validator';

export class BanDTO {
    @IsString()
    @IsNotEmpty()
    reason: string;
}
