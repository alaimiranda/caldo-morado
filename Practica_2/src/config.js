import { join, dirname } from 'node:path';

export const config = {
    port: 3000,
    recursos: join(dirname(import.meta.dirname), 'static'),
    vistas: join(dirname(import.meta.dirname), 'vistas'),
    session: {
        resave: false,
        saveUninitialized: true,
        secret: 'no muy secreto'
    }
}