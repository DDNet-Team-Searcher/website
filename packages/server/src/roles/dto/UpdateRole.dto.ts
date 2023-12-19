import { IsBoolean, IsHexColor, IsOptional, IsString } from "class-validator";

export class UpdateRoleDTO {
    @IsOptional()
    @IsString()
    name?: string;

    @IsString()
    @IsHexColor()
    @IsOptional()
    color?: string;

    @IsString()
    @IsOptional()
    url?: string;

    @IsBoolean()
    @IsOptional()
    canBan?: boolean;

    @IsBoolean()
    @IsOptional()
    canManageRoles?: boolean;

    @IsBoolean()
    @IsOptional()
    canDeleteHappenings?: boolean;

    @IsBoolean()
    @IsOptional()
    canManagePosts?: boolean;
}
