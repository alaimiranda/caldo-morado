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

publicacionesRouter.post('/newPost', upload.single("foto"), body('titulo', 'El titulo tiene que tener entre 4 y 22 caracteres').trim().isLength({min: 4, max: 22}), body('pieDeFoto', 'La descripcion no puede ser vacio').trim().notEmpty(),asyncHandler(publish));

export default publicacionesRouter;