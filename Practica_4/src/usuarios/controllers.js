import { body, validationResult, matchedData } from 'express-validator';
import { Usuario, RolesEnum, UsuarioYaExiste } from './Usuario.js';
import { render } from '../utils/render.js';


export function viewLogin(req, res) {
    let contenido = 'paginas/login';
    if (req.session != null && req.session.login) {
        contenido = 'paginas/home'
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        errores: {}
    });
}

export async function doLogin(req, res) {
    const result = validationResult(req);
    if (! result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/login', {
            errores,
            datos
        });
    }

    body('username').escape();
    body('password').escape();
    // Capturo las variables username y password
    const username = req.body.username;
    const password = req.body.password;

    try {
        const usuario = await Usuario.login(username, password);
        req.session.login = true;
        req.session.username = usuario.username;
        req.session.email = usuario.email;
        req.session.rol = usuario.rol;
        req.session.esAdmin = usuario.rol === RolesEnum.ADMIN;

        res.setFlash(`Encantado de verte de nuevo: ${usuario.username}`);
        return res.redirect('/contenido/perfil');

    } catch (e) {
        const datos = matchedData(req);
        req.log.warn("Problemas al hacer login del usuario '%s'", username);
        req.log.debug('El usuario %s, no ha podido logarse: %s', username, e.message);
        render(req, res, 'paginas/login', {
            error: 'El usuario o contraseña no son válidos',
            datos,
            errores: {}
        });
    }
}

export function doLogout(req, res, next) {
    // https://expressjs.com/en/resources/middleware/session.html
    // logout logic

    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.login = null
    req.session.email = null;
    req.session.esAdmin = null;
    req.session.save((err) => {
        if (err) next(err);

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate((err) => {
            if (err) next(err)
            res.redirect('/');
        })
    })
}


export function viewSignup(req, res) {
    let contenido = 'paginas/signup';
    if (req.session != null && req.session.login) {
        contenido = 'paginas/home'
    }
    res.render('pagina', {
        contenido,
        session: req.session,
        errores: {}
    });
}

export async function doSignup(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/signup', {
            datos,
            errores
        });
    }

    // Capturo las variables username y password
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const email = req.body.email.trim();
    const rol = 'U';
    let fotoperfil = null;


    if (req.file) {
        fotoperfil = req.file.filename;
    }

    try {
        const nuevaUsuario = await Usuario.creaUsuario(username, password, email, fotoperfil, rol);
        //nuevaUsuario.persist();

        req.session.login = true;
        req.session.username = nuevaUsuario.username;
        req.session.rol = nuevaUsuario.rol;

        return res.redirect('/contenido/perfil');
    } catch (e) {
        let error = 'No se ha podido crear el usuario';
        if (e instanceof UsuarioYaExiste) {
            error = 'El nombre de usuario ya está utilizado';
        }
        const datos = matchedData(req);
        delete datos.password;
        req.log.error("Problemas al registrar un nuevo usuario '%s'", username);
        req.log.debug('El usuario no ha podido registrarse: %s', e);
        render(req, res, 'paginas/signup', {
            error,
            datos: {},
            errores: {}
        });
    }

}
