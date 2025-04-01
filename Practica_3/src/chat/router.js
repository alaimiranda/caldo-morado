import express from "express";
import { newChat, newMessage } from "./controllers";

const chatRouter = express.Router();

chatRouter.post('/newChat', newChat);
chatRouter.post('/newMessage', newMessage);

export default chatRouter;