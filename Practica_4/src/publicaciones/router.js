import express from 'express';
import multer from "multer";
import { publish, viewCocinar } from './controllers.js';
import { body } from 'express-validator';
import { autenticado } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';
import { config } from '../config.js';
import { render } from '../utils/render.js';


const upload = multer({ dest: config.uploads });
const publicacionesRouter = express.Router();
publicacionesRouter.get('/newPost', autenticado(null), asyncHandler(viewCocinar));

publicacionesRouter.post('/newPost', publish);

export default publicacionesRouter;