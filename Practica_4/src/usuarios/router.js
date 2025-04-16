import express from 'express';
import multer from "multer";
//import path from 'path';
//import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { viewLogin, doLogin, doLogout, viewSignup, doSignup } from './controllers.js';

const usuariosRouter = express.Router();

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//const multerFactory = multer({ dest: path.join(__dirname, "uploads") });
const upload = multer({ dest: config.uploads });


usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/logout', doLogout);
usuariosRouter.get('/signup', viewSignup);
//usuariosRouter.post('/signup', doSignup);
usuariosRouter.post('/signup', upload.single("foto"), doSignup);

export default usuariosRouter;