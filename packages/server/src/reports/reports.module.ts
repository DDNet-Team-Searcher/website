import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [ReportsService],
    exports: [ReportsService],
})
export class ReportsModule {}
