export const esUsuarioAutenticado = (req, res, next) => {
    if(req.session.usuarioId) {
        return next();
    } 

    res.redirect('/auth/login');
};

export const usuarioMiddleware = (req, res, next) => {

    res.locals.usuarioLogueado =
        req.session.usuarioId || null;

    res.locals.usuarioAvatar =
        req.session.usuarioAvatar || null;

    next();
};