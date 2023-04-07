import { IsDateString, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateEvenDTO {
    @IsString()
    @IsNotEmpty()
    mapName: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    startAt: string;

    @IsNumberString()
    place: number;

    @IsDateString()
    @IsOptional()
    endAt?: string;
    
    //and aslo there's field called thumbnail but it's handled by multer so i dont have to write it here. Ig
}
