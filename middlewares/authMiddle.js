export const esUsuarioAutenticado = (req, res, next) => {
    if(req.session.usuarioId) {
        return next();
    } 

    res.redirect('/auth/login');
}