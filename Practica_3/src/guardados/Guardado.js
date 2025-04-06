
export class Guardado {
    //static #getByTituloStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #searchByUser = null;
    static #searchall = null;

    static initStatements(db) {
        //if (this.#getByTituloStmt !== null) return;

        //this.#getByTituloStmt = db.prepare('SELECT * FROM Guardados WHERE user = @user and id = @id');
        this.#insertStmt = db.prepare('INSERT INTO Guardados(user, id) VALUES (@user, @id)');
        //this.#updateStmt = db.prepare('UPDATE Guardados SET titulo = @titulo, creador_1 = @creador_1, creador_2 = @creador_2, creador_3 = @creador_3, creador_4 = @creador_4, creador_5 = @creador_5, likes = @likes, fecha = @fecha WHERE titulo = @titulo');
        this.#searchall = db.prepare('SELECT * FROM Guardados');
        this.#searchByUser = db.prepare('SELECT * FROM Guardados WHERE user = @user');
    }


    static getGuardadosByUser(user) {
        const datos = {user};
        const guardados = this.#searchByUser.all(datos);
        //console.log(guardados);
        return guardados;
    }

    static #insert(guardado) {
        let result = null;
        try {
            const user = guardado.#user;
            const id = guardado.#id;
            const datos = {user, id};

            result = this.#insertStmt.run(datos);

        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new GuardadoYaExiste(guardado.#user);
            }
            throw new ErrorDatos('No se ha insertado el guardado', { cause: e });
        }
        return result;
    }

    #id;
    #user;

    constructor(user, id) {
        this.#user = user;
        this.#id = id;
    }


    //getters
    get user() {
        return this.#user;
    }
    get id() {
        return this.#id;
    }
    
    
    get creators_tostring(){
        let str = this.#user + ", " + this.#id;
        return str;
    }
    

    // setters
    /*
    set titulo(tituloNuevo){
        this.#titulo = tituloNuevo;
    }
    */

    persist() {
        return Guardado.#insert(this);
    }
}

export class GuardadoNoEncontrado extends Error {
    /**
     * 
     * @param {string} titulo 
     * @param {ErrorOptions} [options]
     */
    constructor(titulo, options) {
        super(`Guardado no encontrado: ${titulo}`, options);
        this.name = 'GuardadoNoEncontrado';
    }
}


export class GuardadoYaExiste extends Error {
    /**
     * 
     * @param {string} user 
     * @param {ErrorOptions} [options]
     */
    constructor(user, options) {
        super(`Guardado ya existe: ${user}`, options);
        this.name = 'GuardadoYaExiste';
    }
}