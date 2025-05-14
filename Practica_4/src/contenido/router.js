import express from 'express';
import { config } from '../config.js';
import { viewCocinar, viewContenidoAdmin, viewContenidoNormal, viewTop, viewPerfil, viewRecetario, viewChat, viewUsuario } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', viewContenidoNormal);
contenidoRouter.get('/top', viewTop);
contenidoRouter.get('/cocinar', viewCocinar);
contenidoRouter.get('/admin', viewContenidoAdmin);
contenidoRouter.get('/perfil', viewPerfil);
contenidoRouter.get('/recetario', viewRecetario);
contenidoRouter.get('/chat', viewChat); 
contenidoRouter.get('/:username', viewUsuario);

export default contenidoRouter;