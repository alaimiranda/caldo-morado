import { body } from 'express-validator';
import { Publicacion } from './Publicacion.js';
//import { colaboradores } from '../../static/js/select.js';


export function publish(req, res) {
    
    body('titulo').escape();
    const titulo = req.body.titulo.trim();
    
    try { 
        let date = new Date();
        let dateToString = date.getDate().toString() + "/" + date.getMonth().toString() + "/" + date.getFullYear().toString() + " " + date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();


        /*
        let colab1 = colaboradores[0] || null;
        let colab2 = colaboradores[1] || null;
        let colab3 = colaboradores[2] || null;
        let colab4 = colaboradores[3] || null;
        let colab5 = colaboradores[4] || null;

        console.log(colaboradores);
        const publicacion = new Publicacion(titulo, colab1, colab2, colab3, colab4, colab5, dateToString);
        colaboradores = [];
        */

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

export function getUserPosts(req, res) {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');  // Si no hay sesión, redirigir a login
    }

    const username = req.session.user.username; // Obtener el username desde la sesión

    try {
        const publicaciones = Publicacion.getPublicacionesByCreador(username);
        res.render('perfil', {
            session: req.session,
            publicaciones
        });
    } catch (error) {
        res.render('perfil', {
            session: req.session,
            error: 'Error al cargar publicaciones'
        });
    }
}