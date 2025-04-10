export function autenticado(urlNoAutenticado = '/usuarios/login', urlAutenticado) {
    return (req, res, next) => {
        if (req.session != null && req.session.login) {
            if (urlAutenticado != undefined) return res.redirect(urlAutenticado);
            return next();
        }
        if (urlNoAutenticado != undefined) {
            return res.redirect(urlNoAutenticado);
        }
        next();
    }
}

export function tieneRol(rol = RolesEnum.ADMIN){
    return (req, res, next) => {
        if (req.session != null && req.session.rol === rol) return next();
        res.render('pagina', {
            contenido: 'paginas/noPermisos',
            session: req.session
        });
    }
}