import { createServer } from 'node:http';
import { host, port, baseUrl} from './config.mjs';
import { requestListener } from './app.mjs';

const server = createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server inicializado en ${baseUrl}`);
});