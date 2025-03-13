import bcrypt from "bcryptjs";

export class Publicacion {
    static #getByTituloStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;

    static initStatements(db) {
        if (this.#getByTituloStmt !== null) return;

        this.#getByTituloStmt = db.prepare('SELECT * FROM Posts WHERE titulo = @titulo');
        this.#insertStmt = db.prepare('INSERT INTO Posts(titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha) VALUES (@titulo, @creador_1, @creador_2, @creador_3, @creador_4, @creador_5, @fecha)');
        this.#updateStmt = db.prepare('UPDATE Posts SET titulo = @titulo, creador_1 = @creador_1, creador_2 = @creador_2, creador_3 = @creador_3, creador_4 = @creador_4, creador_5 = @creador_5, fecha = @fecha WHERE titulo = @titulo');
    }

    static getUsuarioByUsername(username) {
        const publicacion = this.#getByTituloStmt.get({ username });
        if (publicacion === undefined) throw new UsuarioNoEncontrado(titulo);

        const { creador_1, creador_2, creador_3, creador_4, creador_5, fecha, id} = publicacion;

        return new Publicacion(titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, id);
    }

    static #insert(usuario) {
        let result = null;
        try {
            const titulo = usuario.#titulo;
            const creador_1 = usuario.#creador_1;
            const creador_2 = usuario.#creador_2;
            const creador_3 = usuario.#creador_3;
            const creador_4 = usuario.#creador_4;
            const creador_5 = usuario.#creador_5;
            const fecha = usuario.#fecha;
            const datos = {titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha};

            result = this.#insertStmt.run(datos);

            usuario.#id = result.lastInsertRowid;
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new PublicacionYaExiste(usuario.#titulo);
            }
            throw new ErrorDatos('No se ha insertado la publicacion', { cause: e });
        }
        return usuario;
    }

    static #update(usuario) {
        const titulo = usuario.#titulo;
        const creador_1 = usuario.#creador_1;
        const creador_2 = usuario.#creador_2;
        const creador_3 = usuario.#creador_3;
        const creador_4 = usuario.#creador_4;
        const creador_5 = usuario.#creador_5;
        const fecha = usuario.#fecha;
        const datos = {titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha};
        
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new UsuarioNoEncontrado(username);

        return usuario;
    }

    #id;
    #titulo;
    #creador_1;
    #creador_2;
    #creador_3;
    #creador_4;
    #creador_5;
    #fecha;

    constructor(titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, id = null) {
        this.#titulo = titulo;
        this.#creador_1 = creador_1;
        this.#creador_2 = creador_2;
        this.#creador_3 = creador_3;
        this.#creador_4 = creador_4;
        this.#creador_5 = creador_5;
        this.#fecha = fecha;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    set creador_1(nuevoCreador_1) {
        // XXX: En el ej3 / P3 lo cambiaremos para usar async / await o Promises
        this.#creador_1 = bcrypt.hashSync(nuevoCreador_1);
    }

    get titulo() {
        return this.#titulo;
    }

    persist() {
        if (this.#id === null) return Publicacion.#insert(this);
        return Publicacion.#update(this);
    }
}

export class UsuarioNoEncontrado extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario no encontrado: ${username}`, options);
        this.name = 'UsuarioNoEncontrado';
    }
}

export class UsuarioOPasswordNoValido extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario o password no válido: ${username}`, options);
        this.name = 'UsuarioOPasswordNoValido';
    }
}


export class UsuarioYaExiste extends Error {
    /**
     * 
     * @param {string} username 
     * @param {ErrorOptions} [options]
     */
    constructor(username, options) {
        super(`Usuario ya existe: ${username}`, options);
        this.name = 'UsuarioYaExiste';
    }
}