import { ErrorDatos } from "../db.js";
import bcrypt from "bcryptjs";
import { Publicacion } from "../publicaciones/Publicacion.js";

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
        this.#insertStmt = db.prepare('INSERT INTO Usuarios(username, password, email, rol, fotoperfil) VALUES (@username, @password, @email, @rol, @fotoperfil)');
        this.#updateStmt = db.prepare('UPDATE Usuarios SET username = @username, password = @password, rol = @rol, email = @email WHERE id = @id');
        this.#searchall = db.prepare('SELECT * FROM Usuarios');
        this.#searchlike = db.prepare('SELECT * FROM Usuarios WHERE username LIKE @username');
    }
    
    static getAllUsers(){
        const usuarios = this.#searchall.all();
        return usuarios;
    }

    static getBestUsers(){
        const usuarios = this.#searchall.orderBy('puntuacion').all();
        return usuarios;
    }

    static getUsuarioByUsername(username) {
        const usuario = this.#getByUsernameStmt.get({ username });
        if (usuario === undefined) throw new UsuarioNoEncontrado(username);

        const { password, rol, email, id, fotoperfil } = usuario;

        return new Usuario(username, password, email, fotoperfil, rol, id);
    }

    static getUsuarioLike(username) {
        const usuarios = this.#searchlike.all({ username });
        if (usuarios === undefined) throw new UsuarioNoEncontrado(username);
        return usuarios;

    }

    static getUsuariosByPublicacion(id){
        const publicacion = Publicacion.getPublicacionById(id);
        let usuarios = [];
        usuarios.push(this.getUsuarioByUsername(publicacion.creador_1));
        usuarios.push(this.getUsuarioByUsername(publicacion.creador_2));
        if (publicacion.creador_3 != null) {
            usuarios.push(this.getUsuarioByUsername(publicacion.creador_3));
            if (publicacion.creador_4 != null) {
                usuarios.push(this.getUsuarioByUsername(publicacion.creador_4));
                if (publicacion.creador_5 != null) {
                    usuarios.push(this.getUsuarioByUsername(publicacion.creador_5));
                }
            }
        }
        return usuarios;
    }

    static getUsuariosByPublicaciones(publicaciones) {
        let usuariosp = [];
        for (let i = 0; i < publicaciones.length; i++){
            let usuarios = [];
            usuarios.push(this.getUsuarioByUsername(publicaciones[i].creador_1));
            usuarios.push(this.getUsuarioByUsername(publicaciones[i].creador_2));
            if (publicaciones[i].creador_3 != null) {
                usuarios.push(this.getUsuarioByUsername(publicaciones[i].creador_3));
                if (publicaciones[i].creador_4 != null) {
                    usuarios.push(this.getUsuarioByUsername(publicaciones[i].creador_4));
                    if (publicaciones[i].creador_5 != null) {
                        usuarios.push(this.getUsuarioByUsername(publicaciones[i].creador_5));
                    }
                }
            }
            usuariosp.push(usuarios);
        }
        return usuariosp;
    }

    static #insert(usuario) {
        let result = null;
        try {
            const username = usuario.#username;
            const password = usuario.#password;
            const email = usuario.email;
            const fotoperfil = usuario.fotoperfil;
            const rol = usuario.rol;
            const datos = {username, password, email, rol, fotoperfil};

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


    static async login(username, password) {
        let usuario = null;
        try {
            usuario = this.getUsuarioByUsername(username);
        } catch (e) {
            throw new UsuarioOPasswordNoValido(username, { cause: e });
        }

        const passwordMatch = await bcrypt.compare(password, usuario.#password);
        if ( ! passwordMatch ) throw new UsuarioOPasswordNoValido(username);

        return usuario;
    }

    static async creaUsuario(username, password, email, fotoperfil, rol) {
        const usuario = new Usuario(username, password, email, fotoperfil, rol);
        await usuario.cambiaPassword(password);
        usuario.persist();
        return usuario;
    }

    #id;
    #username;
    #password;
    rol;
    email;
    fotoperfil;

    constructor(username, password, email, fotoperfil, rol = RolesEnum.USUARIO, id = null) {
        this.#username = username;
        this.#password = password;
        this.email = email;
        this.fotoperfil = fotoperfil;
        this.rol = rol;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    async cambiaPassword(nuevoPassword) {
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