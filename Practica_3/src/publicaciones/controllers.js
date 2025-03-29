import { body } from 'express-validator';
import { Publicacion } from './Publicacion.js';


export function publish(req, res) {
    
    body('titulo').escape();
    const titulo = req.body.titulo.trim();
    
    try { 
        let date = new Date();
        let dateToString = date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString() + " " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();

        const colaboradores = JSON.parse(req.body.colaboradores || '[]'); // Default to an empty array if not provided
        let colab1 = colaboradores[0] || null;
        let colab2 = colaboradores[1] || null;
        let colab3 = colaboradores[2] || null;
        let colab4 = colaboradores[3] || null;
        let colab5 = colaboradores[4] || null;

        const publicacion = new Publicacion(titulo, colab1, colab2, colab3, colab4, colab5, dateToString);
        
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
