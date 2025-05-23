export class Seguimiento{
    static #insertStmt = null;
    static #getSeguimientoByUsernames = null;
    static #eliminarSeguimiento = null;
    static #getSeguidoresByUsername = null;
    static #getSeguidosByUsername = null;

    static initStatements(db){
        if(this.#getSeguimientoByUsernames !== null) return;

        this.#insertStmt = db.prepare('INSERT INTO Seguimiento(seguidor, seguido) VALUES (@seguidor, @seguido)');
        this.#getSeguimientoByUsernames = db.prepare('SELECT * FROM Seguimiento WHERE seguidor = @seguidor AND seguido = @seguido');
        this.#eliminarSeguimiento = db.prepare('DELETE FROM Seguimiento WHERE seguidor = @seguidor AND seguido = @seguido');
        this.#getSeguidoresByUsername = db.prepare('SELECT * FROM Seguimiento WHERE seguido = @username');
        this.#getSeguidosByUsername = db.prepare('SELECT * FROM Seguimiento WHERE seguidor = @username');
    }
    static getAmigosByUsername(username){
        const seguidores = this.#getSeguidoresByUsername.all({username});
        const seguidos = this.#getSeguidosByUsername.all({username});
        let amigos = new Array();
        seguidores.forEach(s => {
            seguidos.forEach(s2 => {
                if((s.seguidor === s2.seguido) && (s.seguido === s2.seguidor)){
                    let seg = s.seguidor === username ? s2.seguido : s.seguidor;
                    amigos.push(seg);
                }
            });
        });
        return amigos;
    }

    static getSeguimientoByUsernames(seguidor, seguido){
        const seguimiento = this.#getSeguimientoByUsernames.get({seguidor, seguido});
        if(seguimiento === undefined) throw new SeguimientoNoEncontrado(seguidor, seguido);
        return new Seguimiento(seguidor, seguido);
    }

    static eliminarSeguimiento(seguidor, seguido){
        this.#eliminarSeguimiento.run({seguidor, seguido});
    }

    static getSeguidoresByUsername(username){
        const seguidores = this.#getSeguidoresByUsername.all({username});
        let arr = new Array();
        seguidores.forEach(seguido => {
            let seg = new Seguimiento(seguido.seguidor, seguido.seguido);
            arr.push(seg);
        });
        return arr;
    }
    
    static getSeguidosByUsername(username){
        const seguidos = this.#getSeguidosByUsername.all({username});
        let arr = new Array();
        seguidos.forEach(seguidor => {
            let seg = new Seguimiento(seguidor.seguidor, seguidor.seguido);
            arr.push(seg);
        });
        return arr;
    }

    static existeSeguimiento(seguidor, seguido){
        const seguimiento = this.#getSeguimientoByUsernames.get({seguidor, seguido});
        if(seguimiento === undefined) return false;
        return true;
    }

    static async crearSeguimiento(seguidor, seguido){
        const seguimiento = new Seguimiento(seguidor, seguido);
        seguimiento.persists();
        return seguimiento;
    }

    static #insert(seguimiento){
        let result = null;
        try{
            const seguidor = seguimiento.#seguidor;
            const seguido = seguimiento.#seguido;
            const datos = {seguidor, seguido};
            result = this.#insertStmt.run(datos);
        }catch(e){
            if(e.code === 'SQLITE_CONSTRAINT'){
                throw new SeguimientoYaExiste(seguidor, seguido);
            }
        }
        return result;
    }
    #seguidor;
    #seguido;
    constructor(seguidor, seguido){
        this.#seguidor = seguidor;
        this.#seguido = seguido;
    }
    get seguidor(){
        return this.#seguidor;
    }
    get seguido(){
        return this.#seguido;
    }
    persists(){
        return Seguimiento.#insert(this);
    }
}
export class SeguimientoYaExiste extends Error{
    constructor(seguidor, seguido){
        super(`El seguimiento de ${seguidor} a ${seguido} ya existe`);
        this.name = 'SeguimientoYaExiste';
    }
}
export class SeguimientoNoExiste extends Error{
    constructor(seguidor, seguido){
        super(`El seguimiento de ${seguidor} a ${seguido} no existe`);
        this.name = 'SeguimientoNoEncontrado';
    }
}