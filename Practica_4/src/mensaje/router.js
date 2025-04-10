import express  from "express";
import { sendMsg } from "./controllers.js";

const msgRouter = express.Router();

msgRouter.post('/sendMsg', sendMsg);

export default msgRouter;