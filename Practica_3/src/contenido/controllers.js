import { Usuario } from '../../src/usuarios/Usuario.js';
import { Publicacion } from '../../src/publicaciones/Publicacion.js';


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
    
    try {
        const publicaciones = Publicacion.getPublicacionesByCreador(username);
        res.render('pagina', {
            contenido,
            session: req.session,
            publicaciones
        });
    } catch (error) {
        res.render('pagina', {
            contenido, 
            session: req.session,
            error: 'Error al cargar publicaciones'
        });
    }
    /*
    res.render('pagina', {
        contenido,
        session: req.session
    });*/
}