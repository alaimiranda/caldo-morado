import { Usuario } from '../../src/usuarios/Usuario.js';
import { Publicacion } from '../../src/publicaciones/Publicacion.js';
import { Guardado } from '../../src/guardados/Guardado.js';
import { Chat } from '../../src/chat/Chat.js';
import { Seguimiento } from '../seguimiento/Seguimiento.js';


export function viewContenidoNormal(req, res) {
    let contenido = 'paginas/noPermisos';
    if (req.session != null && req.session.nombre != null) {
        contenido = 'paginas/normal';
    }
    res.render('pagina', {
        contenido,
        session: req.session,
    });
}


export function viewTop(req, res) {
    let contenido = 'paginas/top_del_fogon';
    res.render('pagina', {
        contenido,
        session: req.session,
        publicaciones: Publicacion.getMejoresPublicacionesUltimos7dias()
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
    const user = Usuario.getUsuarioByUsername(username);
    const publicaciones = Publicacion.getPublicacionesByCreador(username);
    const usuarios = Usuario.getUsuariosByPublicaciones(publicaciones);
    const seguidores = Seguimiento.getSeguidoresByUsername(username).length;
    const seguidos = Seguimiento.getSeguidosByUsername(username).length;
    res.render('pagina', {
        contenido,
        session: req.session,
        fotoperfil: user.fotoperfil,
        publicaciones: publicaciones,
        usuarios: usuarios,
        seguidores: seguidores,
        seguidos: seguidos
    });
}

export function viewRecetario(req, res) {
    let contenido = 'paginas/normal';  //variable con alcance limitado al bloque
    if (req.session !== null && req.session.login) {
        contenido = 'paginas/recetario';
        const username = req.session.username; // Obtener el username desde la sesión
        const g = Guardado.getGuardadosByUser(username);
        const guardados = [];
        const usuariosPorPublicacion = [];
        g.forEach((guardado) => {
            const publicacion = Publicacion.getPublicacionById(guardado.id);
            guardados.push(publicacion);

            const usuarios = Usuario.getUsuariosByPublicacion(publicacion.id);
            usuariosPorPublicacion.push(usuarios);
        });
        res.render('pagina', {
            contenido,
            session: req.session,
            guardados: guardados,
            usuarios: usuariosPorPublicacion
        });
    } else {
        res.render('pagina', {
            contenido,
            session: req.session
        });
    }

}

export function viewChat(req, res) {
    let contenido = 'paginas/normal';
    if (req.session !== null && req.session.login) {
        contenido = 'paginas/chat';
        const sessionUsername = req.session.username;
        const chats = Chat.getChatsByUsername(sessionUsername);

        chats.forEach((chat) => {
            chat.fecha_ult = new Date(chat.fecha_ult);
            let hora_aux = chat.fecha_ult.getHours() < 10 ? '0' + chat.fecha_ult.getHours() : chat.fecha_ult.getHours();
            hora_aux = hora_aux + ':' + (chat.fecha_ult.getMinutes() < 10 ? '0' + chat.fecha_ult.getMinutes() : chat.fecha_ult.getMinutes());
            chat.fecha_ult = hora_aux;
        });

        let amigos_aux = Seguimiento.getAmigosByUsername(sessionUsername);
        console.log(amigos_aux);
        let amigos = new Array();
        amigos_aux.forEach((amigo) => {
            if(Chat.getChatByUsernames(sessionUsername, amigo) === undefined){
                amigos.push(Usuario.getUsuarioByUsername(amigo).username);
            }
        });
        console.log(amigos);
        res.render('pagina', {
            contenido,
            session: req.session,
            chats,
            sessionUsername,
            amigos
        });
    }else{
        res.render('pagina', {
            contenido,
            session: req.session
        });
    }

}

export function viewUsuario(req, res) {
    let contenido = 'paginas/usuario';
    const username = req.params.username; // Obtener el username desde la sesión
    let userFollow = [];
    if (req.session !== null && req.session.login) {
        const seguimientos = Seguimiento.getSeguidosByUsername(req.session.username);
        userFollow = seguimientos.map(seg => seg.seguido);
    }
    const user = Usuario.getUsuarioByUsername(username);
    const publicaciones = Publicacion.getPublicacionesByCreador(username);
    const usuarios = Usuario.getUsuariosByPublicaciones(publicaciones);
    const seguidores = Seguimiento.getSeguidoresByUsername(username).length;
    const seguidos = Seguimiento.getSeguidosByUsername(username).length;
    res.render('pagina', {
        contenido,
        session: req.session,
        username: username,
        fotoperfil: user.fotoperfil,
        publicaciones: publicaciones,
        usuarios: usuarios,
        seguidores: seguidores,
        seguidos: seguidos,
        userFollow: JSON.stringify(userFollow)
    });
}