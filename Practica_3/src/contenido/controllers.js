import { Usuario } from '../../src/usuarios/Usuario.js';
import { Publicacion } from '../../src/publicaciones/Publicacion.js';
import { Guardado } from '../../src/guardados/Guardado.js';
import { Chat } from '../../src/chat/Chat.js';


export function viewContenidoNormal(req, res) {
    let contenido = 'paginas/noPermisos';
    if (req.session != null && req.session.nombre != null) {
        contenido = 'paginas/normal';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function viewTop(req, res) {
    let contenido = 'paginas/top_del_fogon';
    res.render('pagina', {
        contenido,
        session: req.session,
        publicaciones: Publicacion.getMejoresPublicaciones()
    });
}
export function viewCocinar(req, res) {
    let contenido = 'paginas/normal';
    if (req.session !== null && req.session.login) {
        contenido = 'paginas/cocinar';
    }
    let usuarios = Usuario.getAllUsers();
    res.render('pagina', {
        contenido,
        session: req.session,
        usuarios
    });
}

export function viewContenidoAdmin(req, res) {
    let contenido = 'paginas/noPermisos';
    if (req.session != null && req.session.login && req.session.rol === 'A') { //CAMBIADO ALAI
        contenido = 'paginas/admin';
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function viewPerfil(req, res) {
    let contenido = 'paginas/perfil';
    const username = req.session.username; // Obtener el username desde la sesión
    console.log(username);
    res.render('pagina', {
        contenido,
        session: req.session,
        publicaciones: Publicacion.getPublicacionesByCreador(username)
    });
}

export function viewRecetario(req, res) {
    let contenido = 'paginas/normal';
    const g = null;
    if (req.session !== null && req.session.login) {
        contenido = 'paginas/recetario';
        const username = req.session.username; // Obtener el username desde la sesión
        //g = Guardado.getGuardadosByUser(username);
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        guardados: g
    });
    
}

export function viewChat(req, res) {
    let contenido = 'paginas/normal';
    if (req.session !== null && req.session.login) {
        contenido = 'paginas/chat';
        const sessionUsername = req.session.username; 
        const chats = Chat.getChatsByUsername(sessionUsername);
    
        res.render('pagina', {
            contenido,
            session: req.session,
            chats, 
            sessionUsername
        });
    }else{
        res.render('pagina', {
            contenido,
            session: req.session
        });
    }
    
}