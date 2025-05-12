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
import { logger } from './logger.js';
import pinoHttp  from 'pino-http';
const pinoMiddleware = pinoHttp(config.logger.http(logger));
import { flashMessages } from './middleware/flash.js';
import { errorHandler } from './middleware/error.js';
import publicacionesRouter from './publicaciones/router.js';
import { Publicacion } from './publicaciones/Publicacion.js';
import chatRouter from './chat/router.js';
import { join } from 'node:path';

export const app = express();

app.set('view engine', 'ejs');
app.set('views', config.vistas);

app.use(pinoMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(session(config.session));
app.use(flashMessages);

app.use('/', express.static(config.recursos));
app.get('/', (req, res) => {
    res.render('pagina', {
        contenido: 'paginas/index',
        session: req.session,
        publicaciones : Publicacion.getPublicacionesOrderedByDate()
    });
})
app.use('/usuarios', usuariosRouter);
app.use('/publicaciones', publicacionesRouter);
app.use('/contenido', contenidoRouter);
app.use('/chat', chatRouter);


app.get("/imagen/:id", (req, res) => {
    res.sendFile(join(config.uploads, req.params.id));
});

app.use(errorHandler);