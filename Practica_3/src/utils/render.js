import { error } from "./helpers.js";

export function render(req, res, contenido, params) {
    res.render('pagina', {
        contenido,
        session: req.session,
        helpers: {
            error
        },
        ...params
    });
}