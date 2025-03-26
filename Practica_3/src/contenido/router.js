import express from 'express';
import { viewCocinar, viewContenidoAdmin, viewContenidoNormal, viewTop, viewPerfil } from './controllers.js';
import { getUserPosts } from '../publicaciones/controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', viewContenidoNormal);
contenidoRouter.get('/top', viewTop);
contenidoRouter.get('/cocinar', viewCocinar);
contenidoRouter.get('/admin', viewContenidoAdmin);
contenidoRouter.get('/perfil', viewPerfil);
contenidoRouter.get('/perfil', getUserPosts);


export default contenidoRouter;