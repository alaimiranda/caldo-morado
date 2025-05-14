import { body } from 'express-validator';
import { Multimedia } from './Multimedia.js';


export function publish(req, res) {
    
    try { 

        let id_post ="";
        let pos ="";
        let archivo ="";
        let text ="";

        const multimedia = new Multimedia(id_post, pos, archivo, text);
        
        multimedia.persist();  

        return res.render('pagina', {
            contenido: 'paginas/postConExito',
            session: req.session
        });
       
    } catch (e) {
        res.render('pagina', {
            contenido: 'paginas/cocinar',
            error: 'Error al publicar la receta',
            usuarios: [],
            session: req.session
        })
    }
    
}
