
export class Guardado {
    //static #getByTituloStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #searchByUser = null;
    static #searchall = null;
    static #getSaveFromUserInPost = null;
    static #savesByUser = null;
    static #deleteStmt = null;

    static initStatements(db) {

        this.#insertStmt = db.prepare('INSERT INTO Guardados(user, id) VALUES (@user, @id)');
        this.#searchall = db.prepare('SELECT * FROM Guardados');
        this.#searchByUser = db.prepare('SELECT * FROM Guardados WHERE user = @user');
        this.#getSaveFromUserInPost = db.prepare('SELECT * FROM Guardados WHERE user = @user AND id = @id')
        this.#savesByUser = db.prepare('SELECT id FROM Guardados WHERE user = @user');
        this.#deleteStmt = db.prepare('DELETE FROM Guardados WHERE user = @user AND id = @id');
    }

    static getSaveFromUserInPost(user, id){
        const datos = {user, id};

        const saves = this.#getSaveFromUserInPost.get(datos);
        return saves;
    }
    static getSavesByUser(user){
        const datos = {user};
        const saves = this.#savesByUser.all(datos).map(row => row.id);

        return saves;
    }

    static getGuardadosByUser(user) {
        const datos = {user};
        const guardados = this.#searchByUser.all(datos);
        let arr = new Array();
        guardados.forEach(guardado => {
            let g = new Guardado(guardado.user, guardado.id);
            arr.push(g);
        }
        );
        return arr;
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

    static delete(user, id) {
        const datos = {user, id};

        const result = this.#deleteStmt.run(datos);

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
