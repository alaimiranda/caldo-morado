import { body } from 'express-validator';
import { Publicacion } from './Publicacion';


export function publicar(req, res) {
    
    body('titulo_receta').escape();
    body('fotos').escape();
    body('descripcioes').escape();
  
    const titulo_receta = req.body.titulo_receta.trim();
  
   
    try {
        console.log(titulo_receta);
        let date = new Date();
        console.log(date.getDate().toString());
        const publicacion = new Publicacion(titulo_receta, null, null, null, null, null, date.getDate().toString());
        publicacion.persist();

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