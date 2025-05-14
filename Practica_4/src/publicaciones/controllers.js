import { body, validationResult, matchedData } from 'express-validator';
import { Publicacion } from './Publicacion.js';
import { render } from '../utils/render.js';
import { Multimedia } from '../multimedia/Multimedia.js';


export function viewCocinar(req, res) {
    render(req, res, 'paginas/cocinar', {
            datos: {},
            errores: {}
        });
}

export function publish(req, res) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/cocinar', {
            datos,
            errores
        });
    }
    body('titulo').escape();
    const titulo = req.body.titulo.trim();
    body('pieDeFoto').escape();
    const descripcion = req.body.pieDeFoto.trim();
    let fotos = null;
    if(req.file) {
        fotos = req.file.filename;
    }

    try { 
        let date = new Date().toISOString();

        const colaboradores = JSON.parse(req.body.colaboradores || '[]');
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
        let multimedia = new Multimedia(publicacion.id, 1, fotos, descripcion);
        multimedia.persist();


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
