export function errorHandler (err, req, res, next) {

    if (res.headersSent) {
        req.logger.error(err, 'An error occurred after request was sent')
        return
    }

    // Comprobamos si el error tiene una propiedad que podamos usar como código de error
    let statusCode = 500;
    if ('statusCode' in err) {
        statusCode = err.statusCode;
    }

    // Comprobamossi el error tiene una propiedad que podamos usar como mensaje
    let message = 'Oops, ha ocurrido un error';
    if ('message' in err) {
        message = err.message;
    }

    // Dependiendo del tipo error logamos con un nivel u otro
    const loglevel =
        statusCode === 401 || statusCode === 404
            ? 'debug'
            : statusCode < 500
                ? 'warn'
                : 'error';
    // Equivale a req.log.debug / req.log.warn / req.log.error dependiendo del código de estado
    req.log[loglevel](err);

    // Si es una petición REST => generamos JSON
    if (req.is('application/json')) {
        return res.status(statusCode).json({
            code: statusCode,
            message
        });
    }
    // Si es otro tipo de petición (e.g generada por el usuario) mostramos página de error
    render(eq, res, 'paginas/error', {
        message
    });
}