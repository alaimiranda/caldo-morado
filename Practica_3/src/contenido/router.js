import express from 'express';
import { viewCocinar, viewContenidoAdmin, viewContenidoNormal, viewTop, viewPerfil, viewRecetario, viewChat } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', viewContenidoNormal);
contenidoRouter.get('/top', viewTop);
contenidoRouter.get('/cocinar', viewCocinar);
contenidoRouter.get('/admin', viewContenidoAdmin);
contenidoRouter.get('/perfil', viewPerfil);
contenidoRouter.get('/recetario', viewRecetario);
contenidoRouter.get('/chat', viewChat); 


export default contenidoRouter;