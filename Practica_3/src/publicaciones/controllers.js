import { body } from 'express-validator';
import { Publicacion } from './Publicacion.js';

export function publish(req, res) {
    
    body('titulo').escape();
  
    const titulo = req.body.titulo.trim();

    
    try { 
        let date = new Date();
        let dateToString = date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString() + " " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();

        const publicacion = new Publicacion(titulo, "Ruben", "Alai", "Cata", "Gallo", "Pepe", dateToString);
        publicacion.persist();  

        return res.render('pagina', {
            contenido: 'paginas/postConExito',
            session: req.session
        });
       
    } catch (e) {
        res.render('pagina', {
            contenido: 'paginas/cocinar',
            error: 'Error al publicar la receta'
        })
    }
    
}