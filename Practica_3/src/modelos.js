import { Usuario } from "./usuarios/Usuario.js";
import { Publicacion } from "./publicaciones/Publicacion.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Publicacion.initStatements(db);
}