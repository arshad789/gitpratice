const config = require('config');
const winston = require('winston');

const serverLog = `${config.get('EIMS.server.log.standard.home')}/${config.get('EIMS.server.log.standard.filename')}`;
const debugLog = `${config.get('EIMS.server.log.debug.home')}/${config.get('EIMS.server.log.debug.filename')}`;
const exceptionLog = `${config.get('EIMS.server.log.exception.home')}/${config.get('EIMS.server.log.exception.filename')}`;

const file = new winston.transports.File({
    filename: serverLog,
    level: config.EIMS.server.log.standard.level,
});

const debug = new winston.transports.File({
    filename: debugLog,
    level: config.EIMS.server.log.debug.level,
});

const uncaughtException = new winston.transports.File({
    filename: exceptionLog,
    level: config.EIMS.server.log.exception.level,
});
const console = new winston.transports.Console({
    level: config.EIMS.server.log.standard.level,
});

let customTransports;
// Enable debugging based on EIMS_DEBUG environment variable
if (process.env.EIMS_DEBUG === 'true') {
    customTransports = [file, debug];
} else {
    customTransports = [file];
}

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.splat(),
        winston.format.simple(),
        winston.format.printf((log) => `${log.timestamp} ${log.level}: ${log.message}`),
    ),
    transports: customTransports,
    // This exceptionHandler caught un handled exception and promise log to exception.log
    exceptionHandlers: [
        uncaughtException,
        console,
    ],
});
// Subscribe to unhandle promise rejection event and throw error so that logger can catch and exit
process.on('unhandledRejection', (exception) => {
    throw exception;
});
module.exports = logger;
