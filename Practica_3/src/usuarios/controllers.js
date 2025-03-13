import { body } from 'express-validator';
import { Usuario, RolesEnum, UsuarioYaExiste } from './Usuario.js';

export function viewLogin(req, res) {
    let contenido = 'paginas/login';
    if (req.session != null && req.session.login) {
        contenido = 'paginas/home'
    }
    res.render('pagina', {
        contenido,
        session: req.session
    });
}

export function doLogin(req, res) {
    body('username').escape();
    body('password').escape();
    // Capturo las variables username y password
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    // Proceso las variables comprobando si es un usuario valido
   
    try {
        const usuario = Usuario.login(username, password);
        req.session.login = true;
        req.session.username = username;
        req.session.email = usuario.email;
        req.session.esAdmin = usuario.rol === RolesEnum.ADMIN;

        return res.render('pagina', {
            contenido: 'paginas/home',
            session: req.session
        });
    } catch (e) {
        res.render('pagina', {
            contenido: 'paginas/login',
            error: 'El usuario o contraseña no son válidos'
        })
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
        session: req.session
    });
}

export function doSignup(req, res) {
    body('username').escape();
    body('password').escape();
    body('email').escape();
    // Capturo las variables username y password
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const email = req.body.email.trim();
    const rol = 'U';

    try {
        const nuevaUsuario = new Usuario(username, password, email, rol);
        nuevaUsuario.persist();

        return res.render('pagina', {
            contenido: 'paginas/home',
            session: req.session
        });

    } catch (e) {
        if (e instanceof UsuarioYaExiste) {
            res.status(409).json({ message: e.message });
        } else {
            res.status(500).json({ message: 'Error creating user', e: e.message });
        }
    }
}
