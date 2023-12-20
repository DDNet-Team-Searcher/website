import {
    IsDateString,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString,
} from 'class-validator';

export class EventDTO {
    @IsString()
    @IsNotEmpty()
    mapName: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description: string | null;

    @IsDateString()
    startAt: string;

    @IsNumberString()
    place: string;

    @IsDateString()
    @IsOptional()
    endAt?: string;

    //and aslo there's field called thumbnail but it's handled by multer so i dont have to write it here. Ig
}
