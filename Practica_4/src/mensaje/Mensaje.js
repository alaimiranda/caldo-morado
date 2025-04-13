export class Mensaje{
   static #getMessagesByChat = null;
   static #insertStmt = null;

    static initStatements(db) {
        if (this.#getMessagesByChat !== null) return;
    
        this.#getMessagesByChat = db.prepare('SELECT * FROM Mensajes WHERE id_chat = @id_chat ORDER BY fecha ASC');
        this.#insertStmt = db.prepare('INSERT INTO Mensajes(id_chat, username, mensaje, fecha) VALUES (@id_chat, @username, @mensaje_texto, @fecha)');
    }

    static getMessagesByChat(id_chat) {
        const mensajes = this.#getMessagesByChat.all({ id_chat });
        if (mensajes === undefined) throw new MensajeNoEncontrado(id_chat);
        return mensajes;
    }

    static #insert(mensaje) {
        let result = null;
        try {
            const id_chat = mensaje.#id_chat;
            const username = mensaje.#username;
            const mensaje_texto = mensaje.#mensaje;
            const fecha = mensaje.#fecha;
            const datos = { id_chat, username, mensaje_texto, fecha };

            result = this.#insertStmt.run(datos);

            mensaje.#id = result.lastInsertRowid;
        } catch (error) {
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new MensajeYaExiste(mensaje.#id_chat);
            }
            throw new ErrorDatos('No se ha insertado el mensaje', { cause: e });
        }
        return result;
    }

    #id;
    #id_chat;
    #username;
    #mensaje;
    #fecha;

    constructor(id_chat, username, mensaje, fecha, id = null) {
        this.#id_chat = id_chat;
        this.#username = username;
        this.#mensaje = mensaje;
        this.#fecha = fecha;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    get id_chat() {
        return this.#id_chat;
    }

    get username() {
        return this.#username;
    }

    get mensaje() {
        return this.#mensaje;
    }

    get fecha() {
        return this.#fecha;
    }

    persist() {
        if (this.#id === null) return Mensaje.#insert(this);
        return MensajeNoEncontrado(this);
    }

}

export class MensajeNoEncontrado extends Error {
    constructor() {
        super(`Mensaje no encontrado`);
        this.name = 'MensajeNoEncontrado';
    }
}