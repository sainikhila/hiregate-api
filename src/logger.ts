import { createLogger, format, transports } from 'winston';

// Define custom format for logs
const customFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Create the Winston logger
const logger = createLogger({
    level: 'debug',
    format: customFormat,
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), customFormat)
        })
    ]
});

export default logger;
