
import bcrypt from "bcryptjs";

export const RolesEnum = Object.freeze({
    USUARIO: 'U',
    ADMIN: 'A'
});

export class Usuario {
    static #getByUsernameStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #searchall = null;
    static #searchlike = null;


    static initStatements(db) {
        if (this.#getByUsernameStmt !== null) return;

        this.#getByUsernameStmt = db.prepare('SELECT * FROM Usuarios WHERE username = @username');
        this.#insertStmt = db.prepare('INSERT INTO Usuarios(username, password, email, rol) VALUES (@username, @password, @email, @rol)');
        this.#updateStmt = db.prepare('UPDATE Usuarios SET username = @username, password = @password, rol = @rol, email = @email WHERE id = @id');
        this.#searchall = db.prepare('SELECT * FROM Usuarios');
        this.#searchlike = db.prepare('SELECT * FROM Usuarios WHERE username LIKE @username');
    }
    
    static getAllUsers(){
        const usuarios = this.#searchall.all();
        console.log(usuarios);
        return usuarios;
    }

    static getBestUsers(){
        const usuarios = this.#searchall.orderBy('puntuacion').all();
        return usuarios;
    }

    static getUsuarioByUsername(username) {
        const usuario = this.#getByUsernameStmt.get({ username });
        if (usuario === undefined) throw new UsuarioNoEncontrado(username);

        const { password, rol, email, id } = usuario;

        return new Usuario(username, password, email, rol, id);
    }

    static getUsuarioLike(username) {
        const usuarios = this.#searchlike.all({ username });
        if (usuarios === undefined) throw new UsuarioNoEncontrado(username);
        return usuarios;

    }

    static #insert(usuario) {
        let result = null;
        try {
            const username = usuario.#username;
            const nuevoPassword = usuario.#password;
            const password = bcrypt.hashSync(nuevoPassword);
            const email = usuario.email;
            const rol = usuario.rol;
            const datos = {username, password, email, rol};

            result = this.#insertStmt.run(datos);

            usuario.#id = result.lastInsertRowid;
        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new UsuarioYaExiste(usuario.#username);
            }
            throw new ErrorDatos('No se ha insertado el usuario', { cause: e });
        }
        return usuario;
    }

    static #update(usuario) {
        const username = usuario.#username;
        const password = usuario.#password;
        const email = usuario.email;
        const rol = usuario.rol;
        const datos = {username, password, email, rol};

        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new UsuarioNoEncontrado(username);

        return usuario;
    }


    static login(username, password) {
        let usuario = null;
        try {
            usuario = this.getUsuarioByUsername(username);
        } catch (e) {
            throw new UsuarioOPasswordNoValido(username, { cause: e });
        }

        // XXX: En el ej3 / P3 lo cambiaremos para usar async / await o Promises
        if ( ! bcrypt.compareSync(password, usuario.#password) ) throw new UsuarioOPasswordNoValido(username);

        return usuario;
    }

    #id;
    #username;
    #password;
    rol;
    email;

    constructor(username, password, email, rol = RolesEnum.USUARIO, id = null) {
        this.#username = username;
        this.#password = password;
        this.email = email;
        this.rol = rol;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    set password(nuevoPassword) {
        // XXX: En el ej3 / P3 lo cambiaremos para usar async / await o Promises
        this.#password = bcrypt.hashSync(nuevoPassword);
    }

    get username() {
        return this.#username;
    }

    persist() {
        if (this.#id === null) return Usuario.#insert(this);
        return Usuario.#update(this);
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