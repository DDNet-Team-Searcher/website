import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HappeningsController } from './happenings.controller';
import { HappeningsService } from './happenings.service';

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [HappeningsController],
    providers: [HappeningsService],
    exports: [HappeningsService]
})
export class HappeningsModule {}
