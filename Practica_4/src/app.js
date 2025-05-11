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
import msgRouter from './mensaje/router.js';
import { join } from 'node:path';
import { Multimedia } from './multimedia/Multimedia.js';

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

    res.render('pagina', {
        contenido: 'paginas/index',
        session: req.session,
        publicaciones,
        multimediaPorPost: JSON.stringify(multimediaPorPost)
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
