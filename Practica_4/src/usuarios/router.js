import express from 'express';
import { viewLogin, doLogin, doLogout, viewSignup, doSignup } from './controllers.js';

const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/logout', doLogout);
usuariosRouter.get('/signup', viewSignup);
usuariosRouter.post('/signup', doSignup);

export default usuariosRouter;