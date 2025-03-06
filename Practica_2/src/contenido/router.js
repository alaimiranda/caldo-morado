import express from 'express';
import { viewCocinar, viewContenidoAdmin, viewContenidoNormal, viewTop } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', viewContenidoNormal);
contenidoRouter.get('/top', viewTop);
contenidoRouter.get('/cocinar', viewCocinar);
contenidoRouter.get('/admin', viewContenidoAdmin);

export default contenidoRouter;