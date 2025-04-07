import bcrypt from "bcryptjs";

export class Multimedia {
    static #getByTituloStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #searchall = null;
    static #searchBest = null;
    static #searchById = null;

    static initStatements(db) {
        if (this.#getByTituloStmt !== null) return;

        this.#getByTituloStmt = db.prepare('SELECT * FROM Multimedia WHERE titulo = @titulo and creador_1 = @creador_1');
        this.#insertStmt = db.prepare('INSERT INTO Multimedia (id_post, pos, archivo, text) VALUES (@id_post, @pos, @archivo, @text)');
        this.#updateStmt = db.prepare('UPDATE Multimedia SET pos = @pos, archivo = @archivo, text = @text WHERE id_post = @id_post');
        this.#searchall = db.prepare('SELECT * FROM Multimedia');
        this.#searchById = db.prepare('SELECT * FROM Multimedia WHERE id_post = @id_search');
    }

    static getMejoresMultimedia(){
        const multimedia = this.#searchBest.all();
        return multimedia;
    }

    static getMultimediaByTitulo(username) {
        const multimedia = this.#getByTituloStmt.get({ username });
        if (multimedia === undefined) throw new MultimediaNoEncontrada(titulo);

        const { id_post, pos, archivo, text} = multimedia;

        return new Multimedia(id_post, pos, archivo, text);
    }
    
    static getMultimediaById(id_search) {
        //const creadosql = creador;
        const datos = {id_search};
        const multimedia = this.#searchById.all(datos);
        return multimedia;
    }

    static #insert(multimedia) {
        let result = null;
        try {
            const id_post = multimedia.#id_post;
            const pos = multimedia.#pos;
            const archivo = multimedia.#archivo;
            const text = multimedia.#text;
            const datos = {id_post, pos, archivo, text};

            result = this.#insertStmt.run(datos);

            multimedia.#id_post = result.lastInsertRowid;
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new MultimediaYaExiste(multimedia.#id_post);
            }
            throw new ErrorDatos('No se ha insertado la multimedia', { cause: e });
        }
        return multimedia;
    }

    static #update(multimedia) {
        const id_post = multimedia.#id_post;
        const pos = multimedia.#pos;
        const archivo = multimedia.#archivo;
        const text = multimedia.#text;
        const datos = {id_post, pos, archivo, text};
        
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0)throw new MultimediaNoEncontrada(titulo);

        return multimedia;
    }

    #id_post;
    #pos;
    #archivo;
    #text;


    constructor(id_post, pos, archivo, text) {
        this.#id_post = id_post;
        this.#pos = pos;
        this.#archivo = archivo;
        this.#text = text;
    }


    //getters
    get id_post() {
        return this.#id_post;
    }
    get pos() {
        return this.#pos;
    }
    get archivo() {
        return this.#archivo;
    }
    get text() {
        return this.#text;
    }


    persist() {
        if (this.#id_post === null) return Multimedia.#insert(this);
        return Multimedia.#update(this);
    }
}

export class MultimediaNoEncontrada extends Error {
    /**
     * 
     * @param {string} titulo 
     * @param {ErrorOptions} [options]
     */
    constructor(titulo, options) {
        super(`Multimedia no encontrada: ${titulo}`, options);
        this.name = 'MultimediaNoEncontrada';
    }
}


export class MultimediaYaExiste extends Error {
    /**
     * 
     * @param {string} titulo 
     * @param {ErrorOptions} [options]
     */
    constructor(titulo, options) {
        super(`Multimedia ya existe: ${titulo}`, options);
        this.name = 'MultimediaYaExiste';
    }
}