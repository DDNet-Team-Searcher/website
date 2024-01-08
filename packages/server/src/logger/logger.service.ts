import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { logger } from './logger';

@Injectable()
export class DDTSLoggerService extends ConsoleLogger implements LoggerService {
    constructor(private readonly clsService: ClsService) {
        super();
    }

    requestId(): string | undefined {
        return this.clsService.getId();
    }

    log(message: any, ...optionalParams: any[]): void {
        logger.info(message, { requestId: this.requestId() });
    }

    error(message: any, ...optionalParams: any[]): void {
        logger.error(message, { requestId: this.requestId() });
    }

    warn(message: any, ...optionalParams: any[]): any {
        logger.warn(message, { requestId: this.requestId() });
    }

    debug(message: any, ...optionalParams: any[]): any {
        logger.debug(message, { requestId: this.requestId() });
    }

    verbose(message: any, ...optionalParams: any[]): any {
        logger.verbose(message, { requestId: this.requestId() });
    }

    //do i even need this?
    //setLogLevels?(levels: LogLevel[]): any { }
}
