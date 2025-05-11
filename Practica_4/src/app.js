/*
https://www.digitalocean.com/community/tutorials/nodejs-express-basics
https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
https://ejs.co/
https://expressjs.com/en/starter/hello-world.html
https://appsupport.academy/play-by-play-nodejs-express-sessions-storage-configuration
*/
import express from 'express';
import session from 'express-session';
import multer from "multer";
import { config } from './config.js';
import usuariosRouter from './usuarios/router.js';
import contenidoRouter from './contenido/router.js';
import publicacionesRouter from './publicaciones/router.js';
import { Publicacion } from './publicaciones/Publicacion.js';
import chatRouter from './chat/router.js';
import { join } from 'node:path';
import { Multimedia } from './multimedia/Multimedia.js';
import { Like } from './likes/Like.js';

export const app = express();

//const upload = multer({ dest: config.uploads }); //Para la subida de archivos

app.set('view engine', 'ejs');
app.set('views', config.vistas);

app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));

app.use('/', express.static(config.recursos));
app.get('/', (req, res) => {

    const publicaciones = Publicacion.getPublicacionesOrderedByDate();
    const multimediaPorPost = {};

    publicaciones.forEach(post => {
        multimediaPorPost[post.id] = Multimedia.getMultimediaById(post.id);
    });

    const userLikes = req.session.user ? Like.getLikesByUser(req.session.user.id) : [];

    res.render('pagina', {
        contenido: 'paginas/index',
        session: req.session,
        publicaciones,
        multimediaPorPost: JSON.stringify(multimediaPorPost),
        userlikes: JSON.stringify(userLikes.map(like => like.idPost))
    });
})
app.use('/usuarios', usuariosRouter);
app.use('/publicaciones', publicacionesRouter);
app.use('/contenido', contenidoRouter);
app.use('/chat', chatRouter);



app.get("/imagen/:id", (req, res) => {
    res.sendFile(join(config.uploads, req.params.id));
});

app.post('/like/:postId', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: "Debes iniciar sesión para dar like" });
    }

    const postId = req.params.postId;
    const userId = req.session.user.id;
    
    try {
        // Verificar si el usuario ya dio like a este post
        const existingLike = Like.getLikeFromUser(postId, userId);
        
        if (existingLike) {
            // Si ya existe, quitamos el like
            Like.deleteLike(postId, userId);
            return res.json({ 
                action: "unliked",
                liked: false
            });
        } else {
            // Si no existe, añadimos el like
            const like = new Like(postId, userId);
            like.persist();
            return res.json({ 
                action: "liked",
                liked: true
            });
        }
    } catch (error) {
        console.error("Error al manejar like:", error);
        return res.status(500).json({ 
            error: "Error del servidor al procesar el like" 
        });
    }
});