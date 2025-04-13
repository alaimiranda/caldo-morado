import {body} from 'express-validator';
import {Chat} from './Chat.js';
import { Mensaje } from '../mensaje/Mensaje.js';
import { Usuario } from '../usuarios/Usuario.js';

export function newChat(req, res){
    
}

export function newMessage(req, res){
    
}
export function showChat(req, res){
    let contenido = 'paginas/mensajes'
    const chatId = req.params.chatId;
    const messages = Mensaje.getMessagesByChat(chatId);
 
    const chat = Chat.getChatById(chatId);
    const sessionUser = req.session.username;
    const user_1 = Usuario.getUsuarioByUsername(sessionUser);
    const username_2 = chat.username_1 === sessionUser ? chat.username_2 : chat.username_1;
    const user_2 = Usuario.getUsuarioByUsername(username_2);
    res.render('pagina', {
        contenido,
        session: req.session,
        messages,
        user_1,
        user_2,
        chatId
    });
}