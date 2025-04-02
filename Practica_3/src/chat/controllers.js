import {body} from 'express-validator';
import {Chat} from './Chat.js';

export function newChat(req, res){
    
}

export function newMessage(req, res){
    
}

export function showChats(req, res){
    // Se redirecciona desde contenido con una funcion showChat que muetra los chats 
    const chats = Chat.getChatsByUsername(req.session.username);
    

}