export class Chat{
    static #getChatByUsernames = null;
    static #insertStmt = null;
    static #getChatsByUsername = null;
   
    static initStatemests(db) {
        if (this.#getChatByUsernames !== null) return;

        this.#getChatByUsernames = db.prepare('SELECT * FROM Chats WHERE username_1 = @username_1 AND username_2 = @username_2');
        this.#insertStmt = db.prepare('INSERT INTO Chats(username_1, username_2) VALUES (@username_1, @username_2)');
        this.#getChatsByUsername = db.prepare('SELECT * FROM Chats WHERE username_1 = @username OR username_2 = @username');

    }
     

    static getChatByUsernames(username_1, username_2) {
        const chat = this.#getChatByUsernames.get({ username_1, username_2 });
        if (chat === undefined) throw new ChatNoEncontrado(username_1, username_2);

        const {id} = chat;
        return new Chat(id, username_1, username_2);
    }

    static getChatsByUsername(username) {
        const chats = this.#getChatsByUsername.get({ username });
        console.log(chats);
        if (chats === undefined) throw new ChatNoEncontrado(username);
        return chats;
    }

    static #insert(chat) {
        let result = null;
        try {
            const username_1 = chat.#username_1;
            const username_2 = chat.#username_2;
            const datos = { username_1, username_2 };

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

    #id;
    #username_1;
    #username_2;

    constructor(id = null, username_1, username_2) {
        this.#id = id;
        this.#username_1 = username_1;
        this.#username_2 = username_2;
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

    persists(){
        if (this.#id === null) return Chat.#insert(this);
        return ChatNoEncontrado(this);
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