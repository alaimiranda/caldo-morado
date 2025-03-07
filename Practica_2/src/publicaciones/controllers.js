import { body } from 'express-validator';


export function publicar(req, res) {
    body('titulo').escape();
    // Capturo las variables username y password
    const titulo = req.body.titulo.trim();
    // Proceso las variables comprobando si es un usuario valido
   
    try {
        //const publicacion = Publicacion.constructor(titulo, );

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