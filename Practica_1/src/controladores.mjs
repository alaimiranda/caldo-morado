import { cwd } from 'node:process';
import { join, resolve, normalize, extname } from 'node:path';
import { fstatSync, accessSync, constants, readFileSync, openSync, closeSync } from 'node:fs'; // Ineficiente !, solo para el ejercicio 1 !

const mimeTypes = new Map();
mimeTypes.set('.html', 'text/html;charset=utf-8');
mimeTypes.set('.css', 'text/css');
mimeTypes.set('.js', 'application/javascript');
mimeTypes.set('.png', 'image/png');
mimeTypes.set('.jpg', 'image/jpeg');
mimeTypes.set('.jpeg', 'image/jpeg');
mimeTypes.set('.svg', 'image/svg+xml');

/**
 * 
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res
 *  
 * @returns {boolean} `true` si se ha procesado la petición `false` en otro caso. 
 */
export function estatico(req, res) {
    /*
     * Gestión muy básica que puede tener problemas de seguidad.
     * https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
     */
    const staticFolder = resolve(cwd(), 'static');
    const path = normalize(resolve(join(staticFolder, req.url)));
    if (!path.startsWith(staticFolder)) {
        // Nos están intentando timar,
        notAdmisible(req, res);
        return true;
    }

    // Procesamos la ruta para ver si podemos acceder a ella y si apunta a un fichero o un directorio
    let fd;
    try {
        fd = openSync(path);
        accessSync(path, constants.R_OK);
        const stat = fstatSync(fd);
        if (stat.isDirectory()) {
            // Es directorio, buscamos el fichero index.html dentro del directorio
            req.url += '/index.html';
            return estatico(req, res);
        }
    } catch (e) {
        return false;
    } finally {
        if (fd) {
            closeSync(fd);
        }
    }

    try {
        // enviamos el fichero al cliente con el tipo mime apropiado dependiendo de la extensión
        const ext = extname(path);
        const type = mimeTypes.get(ext) || 'application/octect-stream';
        const content = readFileSync(path);
        res.setHeader("Content-Type", type);
        res.writeHead(200);
        res.end(content);
        return true;
    } catch (err) {
        return false;
    }
}

export function notAdmisible(req, res) {
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.writeHead(406);
    res.end(`<!DOCTYPE html>
<html>
<head>
    <title>No permitido</title>
</head>
<body>
<h1>Operación no permitida</h1>
</body>
</html>`);
}


export function notFound(req, res) {
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.writeHead(404);
    res.end(`<!DOCTYPE html>
<html>
    <head>
        <title>Oops</title>
    </head>
    <body>
    <h1>Página no encontrada</h1>
    </body>
</html>`);
}