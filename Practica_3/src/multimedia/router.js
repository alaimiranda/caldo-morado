import express from 'express';
import { publish } from './controllers.js';

const multimediaRouter = express.Router();

multimediaRouter.post('/newPost', publish);


export default multimediaRouter;