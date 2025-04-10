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

        //this.#getByTituloStmt = db.prepare('SELECT * FROM Multimedia WHERE id_ois = @titulo and creador_1 = @creador_1');
        this.#insertStmt = db.prepare('INSERT INTO Multimedia (post_id, pos, archivo, tipo, texto) VALUES (@post_id, @pos, @archivo, @tipo, @texto)');
        this.#updateStmt = db.prepare('UPDATE Multimedia SET post_id = @post_id, pos = @pos, archivo = @archivo, texto = @texto WHERE post_id = @post_id');
        this.#searchall = db.prepare('SELECT * FROM Multimedia');
        this.#searchById = db.prepare('SELECT * FROM Multimedia WHERE post_id = @id_search');
    }

    static getMejoresMultimedia(){
        const multimedia = this.#searchBest.all();
        return multimedia;
    }

    static getMultimediaByTitulo(username) {
        const multimedia = this.#getByTituloStmt.get({ username });
        if (multimedia === undefined) throw new MultimediaNoEncontrada(titulo);

        const { post_id, pos, archivo, texto} = multimedia;

        return new Multimedia(post_id, pos, archivo, texto);
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
            const post_id = multimedia.#post_id;
            const pos = multimedia.#pos;
            const archivo = multimedia.#archivo;
            const texto = multimedia.#texto;
            const datos = {post_id, pos, archivo, texto};

            result = this.#insertStmt.run(datos);

            multimedia.#post_id = result.lastInsertRowid;
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new MultimediaYaExiste(multimedia.#post_id);
            }
            throw new ErrorDatos('No se ha insertado la multimedia', { cause: e });
        }
        return multimedia;
    }

    static #update(multimedia) {
        const post_id = multimedia.#post_id;
        const pos = multimedia.#pos;
        const archivo = multimedia.#archivo;
        const texto = multimedia.#texto;
        const tipo = multimedia.#tipo;
        const datos = {post_id, pos, archivo, tipo, texto};
        
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0)throw new MultimediaNoEncontrada(titulo);

        return multimedia;
    }

    #post_id;
    #pos;
    #archivo;
    #texto;
    #tipo;


    constructor(post_id, pos, archivo, tipo, texto) {
        this.#post_id = post_id;
        this.#pos = pos;
        this.#archivo = archivo;
        this.#texto = texto;
        this.#tipo = tipo;
    }


    //getters
    get post_id() {
        return this.#post_id;
    }
    get pos() {
        return this.#pos;
    }
    get archivo() {
        return this.#archivo;
    }
    get texto() {
        return this.#texto;
    }
    get tipo() {
        return this.#tipo;
    }

    static createNew(post_id) {
        let multimedia = JSON.parse(req.body.multimedia || '[]'); // Default to an empty array if not provided
        let element;
        for (let i = 0; i < multimedia; i++) {
            //pos_id, pos, archivo, texto
            element = new Multimedia(post_id, i, multimedia.fotos[i], "tipo" , multimedia.descripciones[i]);
            this.#insertStmt.run(element);
        }
    }

    persist() {
        if (this.#post_id === null) return Multimedia.#insert(this);
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