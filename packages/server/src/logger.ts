import winston from 'winston';
import 'winston-daily-rotate-file';

const rotateFiles = new winston.transports.DailyRotateFile({
    filename: './logs/logs-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    //zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

let transport: winston.transport;

if (process.env.NODE_ENV == 'development') {
    transport = new winston.transports.Console();
} else if (process.env.NODE_ENV == 'production') {
    transport = rotateFiles;
} else {
    throw new Error(
        process.env.NODE_ENV +
            ' is not valid value. Use either `development` or `production`',
    );
}

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.json(),
    ),
    level: 'debug',
    transports: [transport],
});
