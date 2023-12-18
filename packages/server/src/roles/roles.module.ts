import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";

@Module({
    imports: [PrismaModule],
    controllers: [RolesController],
    providers: [RolesService]
})
export class RolesModule { }
