import express from 'express';
import multer from "multer";
import { config } from '../config.js';
import { viewLogin, doLogin, doLogout, viewSignup, doSignup } from './controllers.js';
import { autenticado } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';
import { body } from 'express-validator';

const usuariosRouter = express.Router();

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//const multerFactory = multer({ dest: path.join(__dirname, "uploads") });
const upload = multer({ dest: config.uploads });


usuariosRouter.get('/login', autenticado(null), asyncHandler(viewLogin));
usuariosRouter.post('/login', autenticado(null, '/index')
    , body('username', 'No puede ser vacío').trim().notEmpty()
    , body('password', 'No puede ser vacío').trim().notEmpty()
    , asyncHandler(doLogin));

usuariosRouter.get('/logout', doLogout);

usuariosRouter.get('/signup', autenticado(null), asyncHandler(viewSignup));
usuariosRouter.post('/signup', upload.single("foto")
    , body('username', 'Sólo puede contener números y letras').trim().matches(/^[A-Z0-9]*$/i)
    , body('email', 'Debes introducir un email').trim().isEmail()
    , body('username', 'No puede ser vacío').trim().notEmpty()
    , body('password', 'La contraseña no tiene entre 6 y 10 caracteres').trim().isLength({ min: 6, max: 10 })
    , asyncHandler(doSignup));

export default usuariosRouter;
