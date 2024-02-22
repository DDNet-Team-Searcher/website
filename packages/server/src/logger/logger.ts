import winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const rotateFiles = new winston.transports.DailyRotateFile({
    filename: './logs/logs-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    //zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(winston.format.json()),
});

let transport: winston.transport;

if (process.env.NODE_ENV == 'development') {
    transport = new winston.transports.Console({
        format: winston.format.combine(
            nestWinstonModuleUtilities.format.nestLike('DDTS', {
                colors: true,
                prettyPrint: true,
            }),
        ),
    });
} else if (process.env.NODE_ENV == 'production') {
    transport = rotateFiles;
} else {
    throw new Error(
        process.env.NODE_ENV +
            ' is not valid value. Use either `development` or `production`',
    );
}

const addPid = winston.format((info) => {
    info.pid = process.pid;

    return info;
});

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.errors({
            stack: true,
        }),
        addPid(),
    ),
    level: 'verbose',
    transports: [transport],
});
