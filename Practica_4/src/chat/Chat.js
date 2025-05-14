import {Mensaje} from "../mensaje/Mensaje.js";

export class Chat{
    static #getChatByUsernames = null;
    static #insertStmt = null;
    static #getChatsByUsername = null;
    static #getChatById = null;
    static #updateStmt = null;
   
    static initStatemests(db) {
        if (this.#getChatByUsernames !== null) return;

        this.#getChatByUsernames = db.prepare('SELECT * FROM Chats WHERE username_1 = @username_1 AND username_2 = @username_2');
        this.#insertStmt = db.prepare('INSERT INTO Chats(username_1, username_2, ult_mensaje, fecha_ult) VALUES (@username_1, @username_2, @ult_mensaje, @fecha_ult)');
        this.#getChatsByUsername = db.prepare('SELECT * FROM Chats WHERE username_1 = @username OR username_2 = @username ORDER BY fecha_ult DESC');
        this.#getChatById = db.prepare('SELECT * FROM Chats WHERE id = @id');
        this.#updateStmt = db.prepare('UPDATE Chats SET ult_mensaje = @ult_mensaje, fecha_ult = @fecha_ult WHERE username_1 = @username_1 AND username_2 = @username_2');
    }
     
    static getChatById(id) {
        const chat = this.#getChatById.get({ id });
        if (chat === undefined) throw new ChatNoEncontrado(id);
        const {username_1, username_2, fecha_ult, ult_mensaje} = chat;
        return new Chat(username_1, username_2, fecha_ult, ult_mensaje, id);
    }

    static getChatByUsernames(username_1, username_2) {
        const chat = this.#getChatByUsernames.get({ username_1, username_2 });
        if (chat === undefined) {
            const chat2 = this.#getChatByUsernames.get({ username_1: username_2, username_2: username_1 });
            if (chat2 === undefined) return undefined;
            return new Chat(username_2, username_1, chat2.fecha_ult, chat2.ult_mensaje, chat2.id);
        }
        const {fecha_ult, ult_mensaje ,id} = chat;
        return new Chat(username_1, username_2, fecha_ult, ult_mensaje, id);
    }

    static getChatsByUsername(username) {
        const chats = this.#getChatsByUsername.all({ username });
        if (chats === undefined) throw new ChatNoEncontrado(username);
        let cht = new Array();
        chats.forEach(c => {
            cht.push(new Chat(c.username_1, c.username_2, c.fecha_ult, c.ult_mensaje, c.id));
        });
        return chats;
    }

    static #insert(chat) {
        let result = null;
        try {
            const username_1 = chat.#username_1;
            const username_2 = chat.#username_2;
            const fecha_ult = chat.#fecha_ult;
            const ult_mensaje = chat.#ult_mensaje;
            const datos = { username_1, username_2, fecha_ult, ult_mensaje };

            result = this.#insertStmt.run(datos);

            chat.#id = result.lastInsertRowid;
        } catch (error) {
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new ChatYaExiste(chat.#username_1, chat.#username_2);
            }
            throw new ErrorDatos('No se ha insertado el chat', { cause: e });
        }
        return result;
    }

        static #update(chat) {
            const username_1 = chat.#username_1;
            const username_2 = chat.#username_2;
            const fecha_ult = chat.#fecha_ult;
            const ult_mensaje = chat.#ult_mensaje;
            const datos = { username_1, username_2, fecha_ult, ult_mensaje };
            const result = this.#updateStmt.run(datos);
            if (result.changes === 0) throw new ChatNoEncontrado(titulo);
    
            return chat;
        }

    #id;
    #username_1;
    #username_2;
    #fecha_ult;
    #ult_mensaje;

    constructor(username_1, username_2, fecha_ult, ult_mensaje ,id = null) {
        this.#username_1 = username_1;
        this.#username_2 = username_2;
        this.#fecha_ult = fecha_ult;
        this.#ult_mensaje = ult_mensaje;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }
    get username_1() {
        return this.#username_1;
    }
    get username_2() {
        return this.#username_2;
    }
    get fecha_ult() {
        return this.#fecha_ult;
    }
    get ult_mensaje() {
        return this.#ult_mensaje;
    }
    set fecha_ult(fecha_ult) {
        this.#fecha_ult = fecha_ult;
    }
    set ult_mensaje(ult_mensaje) {
        this.#ult_mensaje = ult_mensaje;
    }

    persists(){
        if (this.#id === null) return Chat.#insert(this);
        return Chat.#update(this);
    }
        
}
export class ChatYaExiste extends Error {
    constructor(username_1, username_2) {
        super(`El chat entre ${username_1} y ${username_2} ya existe`);
        this.name = 'ChatYaExiste';
    }
}
export class ChatNoEncontrado extends Error {
    constructor(username_1, username_2) {
        super(`El chat entre ${username_1} y ${username_2} no existe`);
        this.name = 'ChatNoEncontrado';
    }
}