import pino from 'pino';
import { config } from './config.js';
import { join } from 'node:path';

const now = new Date();
const logFile = `${now.toISOString().replaceAll(/[^0-9A-Z]/gi, '_')}.log`; // ó `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}.log`;

const transportConfig = {
    targets: [
        {
            level: config.logger.level,
            target: 'pino/file',
            options: {
                destination: join(config.logs, logFile),
                mkdir: true, // Se crea el directorio de logs si no existe
            }
        }
    ]
};

if (!config.isProduction) {
    transportConfig.targets.push({
        level: config.logger.level,
        target: 'pino/file',
        options: {
            destination: 1 // 1 ==> stdout
        }
    });
}

const loggerOpts = {
    ...config.logger,
    transport: transportConfig
}


process.on('uncaughtException', err => {
    logger.error(err, 'uncaughtException')
    process.exitCode = 1
});

process.on('unhandledRejection', reason =>
    logger.error(reason, 'unhandledRejection')
);


export const logger = pino(loggerOpts);

