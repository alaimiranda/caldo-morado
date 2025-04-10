import {body} from 'express-validator';
import { Mensaje } from './Mensaje.js';

export function sendMsg(req, res){
    body('msg_mensaje').escape();
    const texto_mensaje = req.body.msg_mensaje.trim();
    try{
        let date = new Date();
        let dateToString = date.getFullYear().toString() + "/" + esMenorDiez((date.getMonth() + 1)).toString() + "/" + esMenorDiez(date.getDate()).toString() + " " + esMenorDiez(date.getHours()).toString() + ":" + esMenorDiez(date.getMinutes()).toString() + ":" + esMenorDiez(date.getSeconds()).toString();
        
        //let mensaje = new Mensaje();
        

    }catch(e){
        
    }
}
function esMenorDiez(n){
    if(n < 10){
        return "0" + n;
    }else{
        return n;
    }
}
