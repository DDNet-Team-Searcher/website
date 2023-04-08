import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateReviewDTO {
    @IsNumber()
    rate: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    text: string | null;
}
