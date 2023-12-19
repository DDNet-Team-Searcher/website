import { Module } from '@nestjs/common';
import { HappeningsModule } from 'src/happenings/happenings.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
    imports: [PrismaModule, UsersModule, HappeningsModule],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
