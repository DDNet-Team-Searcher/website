import { Global, Module } from '@nestjs/common';
import { DDTSLoggerService } from './logger.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [DDTSLoggerService],
    exports: [DDTSLoggerService],
})
export class LoggerModule {}
