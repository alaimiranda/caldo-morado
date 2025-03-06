import { Usuario } from "./usuarios/Usuario.js";

export function inicializaModelos(db) {
    Usuario.initStatements(db);
}