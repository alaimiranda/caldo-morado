import bcrypt from "bcryptjs";
import { Multimedia } from "../multimedia/Multimedia.js";

export class Publicacion {
    static #getByTituloStmt = null;
    static #insertStmt = null;
    static #updateStmt = null;
    static #searchall = null;
    static #searchByCreador = null;
    static #searchBest = null;
    static #searchById = null;
    static #searchallOrderByDate = null;
    static #incrementLikes = null;
    static #decrementLikes = null;

    static initStatements(db) {
        if (this.#getByTituloStmt !== null) return;

        this.#getByTituloStmt = db.prepare('SELECT * FROM Posts WHERE titulo = @titulo and creador_1 = @creador_1');
        this.#insertStmt = db.prepare('INSERT INTO Posts(titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, likes) VALUES (@titulo, @creador_1, @creador_2, @creador_3, @creador_4, @creador_5, @fecha, @likes)');
        this.#updateStmt = db.prepare('UPDATE Posts SET titulo = @titulo, creador_1 = @creador_1, creador_2 = @creador_2, creador_3 = @creador_3, creador_4 = @creador_4, creador_5 = @creador_5, likes = @likes, fecha = @fecha WHERE titulo = @titulo');
        this.#searchall = db.prepare('SELECT * FROM Posts');
        this.#searchByCreador = db.prepare('SELECT * FROM Posts WHERE creador_1 = @creador OR creador_2 = @creador OR creador_3 = @creador OR creador_4 = @creador OR creador_5 = @creador');
        this.#searchBest = db.prepare('SELECT * FROM Posts ORDER BY likes DESC');
        this.#searchById = db.prepare('SELECT * FROM Posts WHERE id = @id_search');
        this.#searchallOrderByDate = db.prepare('SELECT * FROM Posts ORDER BY fecha DESC');
        this.#incrementLikes = db.prepare('UPDATE Posts SET likes = likes + 1 WHERE id = @postId')
        this.#decrementLikes = db.prepare('UPDATE Posts SET likes = likes - 1 WHERE id = @postId')
    }

    static incrementLikes(postId){
        const datos = {postId};
        const result = this.#incrementLikes.run(datos);
        return result;
    }
    static decrementLikes(postId){
        const datos = {postId};
        const result = this.#decrementLikes.run(datos);
        return result;
    }

    static getPublicacionesOrderedByDate() {
            const publicaciones = this.#searchallOrderByDate.all();
            return publicaciones;
    }

    static getMejoresPublicaciones() {
        const publicaciones = this.#searchBest.all();
        return publicaciones;
    }

    
    static getMejoresPublicacionesUltimos7dias() {
        const publicaciones = this.#searchBest.all();
        const ahora = new Date();
        const publicacionesRecientes = publicaciones.filter(publicacion => {
            const fechaPublicacion = new Date(publicacion.fecha.replace(/\//g, '-')); // Convertir a formato válido
            const diferenciaDias = (ahora - fechaPublicacion) / (1000 * 60 * 60 * 24); // Diferencia en días
            return diferenciaDias <= 7;
            
        });
        return publicacionesRecientes;
    }


    static getPublicacionByTitulo(username) {
        const publicacion = this.#getByTituloStmt.get({ username });
        if (publicacion === undefined) throw new PublicacionNoEncontrada(titulo);

        const { titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, likes, id } = publicacion;

        return new Publicacion( titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, likes, id );
    }

    static getPublicacionesByCreador(creador) {
        const datos = { creador };
        const publicacionesData = this.#searchByCreador.all(datos);

       
        let ret = [];
        for (let i = 0; i < publicacionesData.length; i++) {
            const { titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, likes, id } = publicacionesData[i];
            ret.push(new Publicacion(titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, likes, id));
        }

        return ret;
    }

    static getPublicacionById(id_search) {
        //const creadosql = creador;
        const datos = {id_search};
        const data = this.#searchById.all(datos);
        const { titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, likes, id } = data[0];
        const publicacion = new Publicacion(titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, likes, id);
        return publicacion;
    }

    static #insert(publicacion) {
        let result = null;
        try {
            const titulo = publicacion.#titulo;
            const creador_1 = publicacion.#creador_1;
            const creador_2 = publicacion.#creador_2;
            const creador_3 = publicacion.#creador_3;
            const creador_4 = publicacion.#creador_4;
            const creador_5 = publicacion.#creador_5;
            const fecha = publicacion.#fecha;
            const likes = publicacion.#likes;
            const datos = {titulo, creador_1, creador_2, creador_3, creador_4, creador_5, likes, fecha};

            result = this.#insertStmt.run(datos);
            publicacion.#id = result.lastInsertRowid;


        } catch(e) { // SqliteError: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#class-sqliteerror
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new PublicacionYaExiste(publicacion.#titulo);
            }
            throw new ErrorDatos('No se ha insertado la publicacion', { cause: e });
        }
        return publicacion;
    }

    static #update(publicacion) {
        const titulo = publicacion.#titulo;
        const creador_1 = publicacion.#creador_1;
        const creador_2 = publicacion.#creador_2;
        const creador_3 = publicacion.#creador_3;
        const creador_4 = publicacion.#creador_4;
        const creador_5 = publicacion.#creador_5;
        const likes = publicacion.#likes;
        const fecha = publicacion.#fecha;
        const datos = {titulo, creador_1, creador_2, creador_3, creador_4, creador_5, likes, fecha};
        
        const result = this.#updateStmt.run(datos);
        if (result.changes === 0) throw new PublicacionNoEncontrada(titulo);

        return publicacion;
    }

    #id;
    #titulo;
    #creador_1;
    #creador_2;
    #creador_3;
    #creador_4;
    #creador_5;
    #likes;
    #fecha;

    constructor(titulo, creador_1, creador_2, creador_3, creador_4, creador_5, fecha, likes=0, id = null) {
        this.#titulo = titulo;
        this.#creador_1 = creador_1;
        this.#creador_2 = creador_2;
        this.#creador_3 = creador_3;
        this.#creador_4 = creador_4;
        this.#creador_5 = creador_5;
        this.#fecha = fecha;
        this.#likes = likes;
        this.#id = id;
    }

    //getters
    get titulo() {
        return this.#titulo;
    }
    get id() {
        return this.#id;
    }
    get creador_1(){
        return this.#creador_1;
    }
    get creador_2(){
        return this.#creador_2;
    }
    get creador_3(){
        return this.#creador_3;
    }
    get creador_4(){
        return this.#creador_4;
    }
    get creador_5(){
        return this.#creador_5;
    }
    get likes(){
        return this.#likes;
    }
    get fecha(){
        return this.#fecha;
    }

    get creators_tostring() {
        if (this.#creador_1 == null || this.#creador_2 == null)
        throw NumeroDeColaboradoresNoValido();

        let str = this.#creador_1 + ", " + this.#creador_2;
        if (this.#creador_3 != null) {
        str += ", " + this.#creador_3;
        if (this.#creador_4 != null) {
            str += ", " + this.#creador_4;
            if (this.#creador_5 != null) {
            str += ", " + this.#creador_5;
            }
        }
        }
        return str;
    }

    // setters
    set titulo(tituloNuevo){
        this.#titulo = tituloNuevo;
    }

    persist() {
        if (this.#id === null) return Publicacion.#insert(this);
        return Publicacion.#update(this);
    }
}

export class PublicacionNoEncontrada extends Error {
    /**
     *
     * @param {string} titulo
     * @param {ErrorOptions} [options]
     */
    constructor(titulo, options) {
        super(`Usuario no encontrado: ${titulo}`, options);
        this.name = 'PublicacionNoEncontrada';
    }
}

export class NumeroDeColaboradoresNoValido extends Error {
    /**
     * 
     * @param {string} titulo 
     * @param {ErrorOptions} [options]
     */
    constructor(titulo, options) {
        super(`Usuario o password no válido: ${titulo}`, options);
        this.name = 'NumeroDeColaboradoresNoValido';
    }
}

export class PublicacionYaExiste extends Error {
    /**
     * 
     * @param {string} titulo 
     * @param {ErrorOptions} [options]
     */
    constructor(titulo, options) {
        super(`Usuario ya existe: ${titulo}`, options);
        this.name = 'PublicacionYaExiste';
    }
}
