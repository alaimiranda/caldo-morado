import express  from "express";
import { body } from 'express-validator';
import { sendMsg } from "./controllers.js";
import { autenticado } from "../middleware/auth.js";
import asyncHandler from 'express-async-handler';

const msgRouter = express.Router();

msgRouter.post('/sendMsg', autenticado(null), body('msg_mensaje', 'No puede ser vacio').trim().notEmpty(), asyncHandler(sendMsg));

export default msgRouter;