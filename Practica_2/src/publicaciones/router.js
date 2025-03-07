import express from 'express';
import { viewCocinar, viewContenidoAdmin, viewContenidoNormal, viewTop } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/nueva', publicar);

export default contenidoRouter;