/*
https://www.digitalocean.com/community/tutorials/nodejs-express-basics
https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
https://ejs.co/
https://expressjs.com/en/starter/hello-world.html
https://appsupport.academy/play-by-play-nodejs-express-sessions-storage-configuration
*/
import express from 'express';
import session from 'express-session';
import { config } from './config.js';
import usuariosRouter from './usuarios/router.js';
import contenidoRouter from './contenido/router.js';
import publicacionesRouter from './publicaciones/router.js';
import { Publicacion } from './publicaciones/Publicacion.js';
import chatRouter from './chat/router.js';
import msgRouter from './mensaje/router.js';
import { join } from 'node:path';
import { Multimedia } from './multimedia/Multimedia.js';
import { Like } from './likes/Like.js';
import { Usuario } from './usuarios/Usuario.js';
import { Seguimiento } from './seguimiento/Seguimiento.js';
import { Guardado } from './guardados/Guardado.js';
import { logger } from './logger.js';
import pinoHttp  from 'pino-http';
const pinoMiddleware = pinoHttp(config.logger.http(logger));
import { flashMessages } from './middleware/flash.js';
import { errorHandler } from './middleware/error.js';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', config.vistas);

app.use(pinoMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));
app.use(flashMessages);

app.use('/', express.static(config.recursos));
app.get('/', (req, res) => {

    const publicaciones = Publicacion.getPublicacionesOrderedByDate();
    const multimediaPorPost = {};

    publicaciones.forEach(post => {
        multimediaPorPost[post.id] = Multimedia.getMultimediaById(post.id);
    });
    const usuarios = Usuario.getUsuariosByPublicaciones(publicaciones);

    let user = null;
    let userLikes = [];
    let userSaves = [];
    let userId = null;

    if(req.session.username !== undefined){
        user = Usuario.getUsuarioByUsername(req.session.username);
        userLikes = Like.getLikesByUser(user.id);
        userSaves = Guardado.getSavesByUser(req.session.username);
        userId = user.id;
    }

    let usuarios_aux = Usuario.getAllUsers();
    let allUsers = new Array();
    usuarios_aux.forEach((usuario) => {
        allUsers.push(usuario.username);
    });

    console.log(userId);
    res.render('pagina', {
        contenido: 'paginas/index',
        session: req.session,
        publicaciones,
        usuarios,
        multimediaPorPost: JSON.stringify(multimediaPorPost),
        userId: userId,
        userLikes: JSON.stringify(userLikes),
        userSaves: JSON.stringify(userSaves),
        allUsers
    });
})
app.use('/usuarios', usuariosRouter);
app.use('/publicaciones', publicacionesRouter);
app.use('/contenido', contenidoRouter);
app.use('/chat', chatRouter);
app.use('/mensaje', msgRouter);
app.get("/imagen/:id", (req, res) => {
    res.sendFile(join(config.uploads, req.params.id));
});


app.post('/like/:postId', (req, res) => {

    if (!req.session.login) {
        return res.status(401).json({ error: "Debes iniciar sesión para dar like a una receta" });
    }

    const postId = req.params.postId;
    const userId = Usuario.getUsuarioByUsername(req.session.username).id;
    
    try {
        const existingLike = Like.getLikeFromUserInPost(postId, userId);
        
        if (existingLike) {
            Like.delete(postId, userId);
            Publicacion.decrementLikes(postId);
            return res.json({ liked: false });
        } else {
            const like = new Like(postId, userId);
            like.persist();
            Publicacion.incrementLikes(postId);
            return res.json({ liked: true });
        }
    } catch (error) {
        console.error("Error al manejar like:", error);
        return res.status(500).json({ 
            error: "Error del servidor al procesar el like" 
        });
    }
});

app.post('/save/:postId', (req, res) => {

    if (!req.session.login) {
        return res.status(401).json({ error: "Debes iniciar sesión para guardar una receta" });
    }

    const postId = req.params.postId;
    const user = req.session.username;

    try {
        const existingSave = Guardado.getSaveFromUserInPost(user, postId);
        
        if (existingSave) {
            Guardado.delete(user, postId);
            return res.json({ saved: false });
        } else {
            const save = new Guardado(user, postId);
            save.persist();
            return res.json({ saved: true });
        }
    } catch (error) {
        console.error("Error al manejar save:", error);
        return res.status(500).json({ 
            error: "Error del servidor al procesar el save" 
          });
    }
});

app.post('/follow/:username', (req, res) => {

    if (!req.session.login) {
        return res.status(401).json({ error: "Debes iniciar sesión para seguir" });
    }
    const username = req.params.username;

    const userId = Usuario.getUsuarioByUsername(req.session.username).id;
    
    try {
        const existingFollow = Seguimiento.existeSeguimiento(req.session.username, username);
        
        if (existingFollow) {
            Seguimiento.eliminarSeguimiento(req.session.username, username);
            return res.json({ followed: false });
        } else {
            const follow = Seguimiento.crearSeguimiento(req.session.username, username);
            return res.json({ liked: true });
        }
    } catch (error) {
        console.error("Error al manejar follow:", error);
        return res.status(500).json({ 
            error: "Error del servidor al procesar el follow" 
          });
    }
});


app.use(errorHandler);
