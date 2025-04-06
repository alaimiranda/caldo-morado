import express from "express";
import { newChat, newMessage, showChat } from "./controllers.js";

const chatRouter = express.Router();

chatRouter.post('/newChat', newChat);
chatRouter.get('/:chatId', showChat);

export default chatRouter;