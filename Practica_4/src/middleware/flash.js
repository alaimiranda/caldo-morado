export function flashMessages(request, response, next) {
    response.setFlash = (msg) => {
        request.session.flashMsg = msg;    
    };
    
    response.locals.getAndClearFlash = () => {
        let msg = request.session.flashMsg;
        delete request.session.flashMsg;
        return msg;
    }

    next();
}