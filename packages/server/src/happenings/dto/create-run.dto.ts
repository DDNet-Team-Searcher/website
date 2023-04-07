import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRunDTO {
    @IsString()
    @IsNotEmpty()
    mapName: string;

    @IsNumber()
    @IsNotEmpty()
    teamSize: number;

    @IsNumber()
    @IsNotEmpty()
    place: number;

    @IsOptional()
    @IsString()
    description: string | null;

    @IsDateString()
    @IsNotEmpty()
    startAt: string;
}
