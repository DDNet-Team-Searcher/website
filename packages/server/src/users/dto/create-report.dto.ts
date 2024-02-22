import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDTO {
    @IsString()
    @IsNotEmpty()
    reason: string;
}
