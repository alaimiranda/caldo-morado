import { notFound, estatico } from "./controladores.mjs";
import { baseUrl } from './config.mjs';

export function requestListener(req, res) {
    let handler = null;

    // procesa URLs que hacen referencia a ficheros / directorios que están dentro del directorio static
    if (estatico(req, res)) {
        return;
    }

    const url = new URL(`${baseUrl}${req.url}`);
    const path = url.pathname;
    switch(path) {
        case "/saludos":
            handler = saludo;
            break;    
        default:
            handler = notFound;
            break;
    }
    handler(req, res);
}


function saludo(req, res) {
    const url = new URL(`${baseUrl}${req.url}`);
    // TODO: Incluye tu código aquí.
};