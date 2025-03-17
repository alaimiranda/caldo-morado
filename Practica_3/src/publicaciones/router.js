import express from 'express';
import { publicar } from './controllers.js';

const publicacionesRouter = express.Router();

publicacionesRouter.post('/nueva', publicar);

export default publicacionesRouter;