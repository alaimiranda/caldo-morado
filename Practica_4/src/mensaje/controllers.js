import {body} from 'express-validator';
import { Mensaje } from './Mensaje.js';
import { Chat } from '../chat/Chat.js';
import { Usuario } from '../usuarios/Usuario.js';

export function sendMsg(req, res){
    body('msg_mensaje').escape();
    const texto_mensaje = req.body.msg_mensaje.trim();
    try{
        let date = new Date();
        let dateToString = date.getFullYear().toString() + "/" + esMenorDiez((date.getMonth() + 1)).toString() + "/" + esMenorDiez(date.getDate()).toString() + " " + esMenorDiez(date.getHours()).toString() + ":" + esMenorDiez(date.getMinutes()).toString() + ":" + esMenorDiez(date.getSeconds()).toString();
        let chatId = req.body.chatId;
        let username = req.session.username;
        const mensaje = new Mensaje(chatId, username, texto_mensaje, dateToString);
        mensaje.persist();

        const messages = Mensaje.getMessagesByChat(chatId);
        const chat = Chat.getChatById(chatId);
        const sessionUser = username;
        const user_1 = Usuario.getUsuarioByUsername(sessionUser);
        const username_2 = chat.username_1 === sessionUser ? chat.username_2 : chat.username_1;
        const user_2 = Usuario.getUsuarioByUsername(username_2);
        res.render('pagina', {
            contenido : 'paginas/mensajes',
            session: req.session,
            messages,
            user_1,
            user_2,
            chatId
        });
    }catch(e){
        res.render('pagina', {
            contenido: 'paginas/mensajes',
            error: 'Error al mandar el mensaje'
        })
    }
}
function esMenorDiez(n){
    if(n < 10){
        return "0" + n;
    }else{
        return n;
    }
}
