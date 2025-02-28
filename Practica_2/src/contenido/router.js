import express from 'express';
import { viewContenidoAdmin, viewContenidoNormal, viewTop } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/normal', viewContenidoNormal);
contenidoRouter.get('/top', viewTop);
contenidoRouter.get('/admin', viewContenidoAdmin);

export default contenidoRouter;