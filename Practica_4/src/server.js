import { config } from './config.js';
import { app } from './app.js';
import { getConnection, checkConnection, closeConnection} from './db.js';
import { inicializaModelos } from './modelos.js';

const db = getConnection();
checkConnection(db);
inicializaModelos(db);

const server = app.listen(config.port, (error) => {
    if (error) return console.log(`Error: ${error}`);
    const address = server.address();
    let actualPort = 'n/a';
    if (typeof address === 'string')  {
        actualPort = address;
    } else {
        actualPort = String(address.port);
    }
    console.log(`Server is listening on port ${actualPort}`);
});

process.on('exit', () => {
    server.close();
    closeConnection();
});

process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));