import express from "express";
import { newChat, newMessage, showChats } from "./controllers";

const chatRouter = express.Router();

chatRouter.post('/newChat', newChat);
chatRouter.post('/newMessage', newMessage);
chatRouter.get('/showChats', showChats);

export default chatRouter;