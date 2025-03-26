import express from 'express';
import { publish } from './controllers.js';

const publicacionesRouter = express.Router();

publicacionesRouter.post('/newPost', publish);


export default publicacionesRouter;