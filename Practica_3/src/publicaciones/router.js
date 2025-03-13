import express from 'express';
import { publicar } from './controllers.js';

const contenidoRouter = express.Router();

contenidoRouter.get('/nueva', publicar);

export default contenidoRouter;