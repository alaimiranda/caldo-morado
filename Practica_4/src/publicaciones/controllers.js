import { body, validationResult, matchedData } from 'express-validator';
import { Publicacion } from './Publicacion.js';
import { render } from '../utils/render.js';


export function viewCocinar(req, res) {
    render(req, res, 'paginas/cocinar', {
            datos: {},
            errores: {}
        });
}

export function publish(req, res) {
    // TODO:
    // XXX Faltan validaciones con express-validator + lógica apropiada para verificar la existencia
    // y/o tipos de los parámetros

    // XXX Además de para casos de error, puedes usar matchedData(req) para sacar los datos que te interesan
    body('titulo').escape();
    const titulo = req.body.titulo.trim();

    try { 
        let date = new Date().toISOString();

        const colaboradores = JSON.parse(req.body.colaboradores || '[]'); // Default to an empty array if not provided
        console.log("colaboradores", colaboradores);
        let colab1 = colaboradores[0] || null;
        let colab2 = colaboradores[1] || null;
        let colab3 = colaboradores[2] || null;
        let colab4 = colaboradores[3] || null;
        let colab5 = colaboradores[4] || null;


        if (!colab2) {
            return res.render('pagina', {
                contenido: 'paginas/cocinar',
                error: 'Error al publicar la receta',
                usuarios: [],
                session: req.session
            })
        }

        const publicacion = new Publicacion(
            titulo,
            colab1,
            colab2,
            colab3,
            colab4,
            colab5,
            date
        );
        //let multimedia = req.body.multimedia;

        publicacion.persist();

        return res.render('pagina', {
            contenido: 'paginas/postConExito',
            session: req.session,
        });
       
    } catch (e) {
        res.render('pagina', {
            contenido: 'paginas/cocinar',
            error: 'Error al publicar la receta',
            usuarios,
            session: req.session
        })
    }
    
}
