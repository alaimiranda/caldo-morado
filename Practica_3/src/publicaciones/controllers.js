import { body } from 'express-validator';
import { Publicacion } from './Publicacion.js';

export function publish(req, res) {
    
    body('titulo').escape();
    body('colab1').escape();
    body('colab2').escape();
    body('colab3').escape();
    body('colab4').escape();
    body('colab5').escape();

  
    const titulo = req.body.titulo.trim();
    const colab1 = req.body.colab1.trim();
    const colab2 = req.body.colab2.trim();
    const colab3 = req.body.colab3.trim();
    const colab4 = req.body.colab4.trim(); 
    const colab5 = req.body.colab5.trim();
    
    try { 
        let date = new Date();
        let dateToString = date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString() + " " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();

        //const publicacion = new Publicacion(titulo, "Ruben", "Alai", "Cata", "Gallo", "Pepe", dateToString);
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