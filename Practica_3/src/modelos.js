import { Usuario } from "./usuarios/Usuario.js";
import { Publicacion } from "./publicaciones/Publicacion.js";
import { Chat } from "./chat/Chat.js";
import { Mensaje } from "./mensaje/Mensaje.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
    Publicacion.initStatements(db);
    Chat.initStatemests(db);
    Mensaje.initStatements(db);
}