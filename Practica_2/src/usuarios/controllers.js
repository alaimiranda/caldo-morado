import { body } from 'express-validator';

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
    if (username === "user" && password === "userpass"){
        // Establecer la variable de sesion login a true y nombre a "Usuario"
        req.session.login = true;
        req.session.nombre = 'Usuario';
        return res.render('pagina', {
            contenido: 'paginas/home',
            session: req.session
        });
    } else if (username === "admin" && password === "adminpass"){
        // Establecer la variable de sesion login a true y nomnbre a "Administrador"
        // Establecer la variable esAdmin a true
        req.session.login = true;
        req.session.nombre = 'Administrador';
        req.session.esAdmin = true;
        return res.render('pagina', {
            contenido: 'paginas/home',
            session: req.session
        });
    }

    res.render('pagina', {
        contenido: 'paginas/login',
        error: 'El usuario o contraseña no son válidos'
    })
}

export function doLogout(req, res, next) {
    // https://expressjs.com/en/resources/middleware/session.html
    // logout logic

    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.login = null
    req.session.nombre = null;
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
