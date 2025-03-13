import express from 'express';
import { viewLogin, doLogin, doLogout } from './controllers.js';

const usuariosRouter = express.Router();

usuariosRouter.get('/login', viewLogin);
usuariosRouter.post('/login', doLogin);
usuariosRouter.get('/logout', doLogout);

export default usuariosRouter;