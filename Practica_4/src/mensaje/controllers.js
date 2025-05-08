import {body, validationResult} from 'express-validator';
import { Mensaje } from './Mensaje.js';
import { Chat } from '../chat/Chat.js';
import { Usuario } from '../usuarios/Usuario.js';

export function sendMsg(req, res){
    const result = validationResult(req);
    if(!result.isEmpty()){
        const errores = result.mapped();
        const datos = matchedData(req);
        return render(req, res, 'paginas/mensaje', {
            errores,
            datos
        });
    }
    let texto_mensaje = req.body.msg_mensaje;
    try{
        let date = new Date().toISOString();
        let chatId = req.body.chatId;
        let username = req.session.username;
        const mensaje = new Mensaje(chatId, username, texto_mensaje, date);
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

