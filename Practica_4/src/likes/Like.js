
export class Like {

    static #insertStmt = null;
    static #deleteStmt = null;
    static #searchAll = null;
    static #searchByPost = null;
    static #likesByUser = null;
    static #getLikeFromUserInPost = null;


    static initStatements(db){
        this.#insertStmt = db.prepare('INSERT INTO Likes(idPost, idUsuario) VALUES (@idPost, @idUsuario)');
        this.#deleteStmt = db.prepare('DELETE FROM Likes WHERE idPost = @idPost AND idUsuario = @idUsuario');
        this.#searchAll = db.prepare('SELECT * FROM Likes');
        this.#searchByPost = db.prepare('SELECT * FROM Likes WHERE idPost = @idPost');
        this.#likesByUser = db.prepare('SELECT idPost FROM Likes WHERE idUsuario = @idUsuario');
        this.#getLikeFromUserInPost = db.prepare('SELECT * FROM Likes WHERE idPost = @idPost AND idUsuario = @idUsuario');
    }
    
    static getLikeFromUserInPost(idPost, idUsuario){
        const datos = {idPost, idUsuario};

        const likes = this.#getLikeFromUserInPost.get(datos);
        return likes;
    }

    static getLikesByUser(idUsuario){
        const datos = {idUsuario};
        const likes = this.#likesByUser.all(datos).map(row => row.idPost);

        return likes;
    }

    static getAllLikes(){
        const likes = this.#searchAll.all();

        return likes;
    }

    static getLikeFromPost(idPost){
        const datos = {idPost};
        const likes = this.#searchByPost.all(datos);

        return likes;
    }

    static #insert(like) {
        let result = null;
        try {
            const idPost = like.#idPost;
            const idUsuario = like.#idUsuario;
            const datos = {idPost, idUsuario};

            result = this.#insertStmt.run(datos);
        } catch(e) {
            if (e.code === 'SQLITE_CONSTRAINT') {
                throw new LikeYaExiste(like.#idPost);
            }
            throw new ErrorDatos('No se ha insertado el like', { cause: e });
        }
        return result;
    }

    static delete(idPost, idUsuario) {
        const datos = {idPost, idUsuario};

        const result = this.#deleteStmt.run(datos);

        return result;
    }

    #idPost;
    #idUsuario;

    constructor(idPost, idUsuario) {
        this.#idPost = idPost;
        this.#idUsuario = idUsuario;
    }

    get idPost(){
        return this.#idPost;
    }
    get idUsuario(){
        return this.#idUsuario;
    }

    get creators_tostring(){
        let str = this.#idPost + ", " + this.#idUsuario;
        return str;
    }

    persist() {
        return Like.#insert(this);
    }

}

export class LikeYaExiste extends Error {
    /**
     * 
     * @param {string} idPost 
     * @param {ErrorOptions} [options]
     */
    constructor(idPost, options) {
        super(`Like ya existe: ${idPost}`, options);
        this.name = 'LikeYaExiste';
    }
}
export class LikeNoExiste extends Error {
    /**
     * 
     * @param {string} idPost 
     * @param {string} idUsuario
     * @param {ErrorOptions} [options]
     */
    constructor(idPost, options) {
        super(`Like no existe: ${idPost, idUsuario}`, options);
        this.name = 'LikeNoExiste';
    }
}