import express from "express";
import { newChat,showChat } from "./controllers.js";
import { autenticado } from '../middleware/auth.js';
import asyncHandler from 'express-async-handler';


const chatRouter = express.Router();

chatRouter.post('/:user_2', autenticado(null), asyncHandler(newChat));
chatRouter.get('/:chatId', autenticado(null), asyncHandler(showChat));

export default chatRouter;