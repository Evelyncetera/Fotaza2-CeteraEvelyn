import User from '../models/Usuario.js';
import Rol from '../models/Rol.js';

export const esUsuarioAutenticado = (req, res, next) => {
    if(req.session.usuarioId) {
        return next();
    } 

    res.redirect('/auth/login');
};

export const usuarioMiddleware = async (req, res, next) => {
    try {
        res.locals.usuarioLogueado = null;
        res.locals.usuarioAvatar = null;
        res.locals.usuarioRol = null;

        res.locals.mensaje =
            req.session.mensaje || null;

        res.locals.tipoMensaje =
            req.session.tipoMensaje || 'info';

        delete req.session.mensaje;
        delete req.session.tipoMensaje;

        if (!req.session.usuarioId) {
            return next();
        }

        const usuario = await User.findByPk(
            req.session.usuarioId,
            {
                attributes: [
                    'id',
                    'activo',
                    'avatar'
                ]
            }
        );

        if (!usuario || !usuario.activo) {
            return req.session.destroy(() => {
                next();
            });
        }

        res.locals.usuarioLogueado = usuario.id;
        res.locals.usuarioAvatar =
            usuario.avatar || null;

        res.locals.usuarioRol =
            req.session.usuarioRol || null;

        next();

    } catch (error) {
        next(error);
    }
};

export const esValidador = async (req, res, next) => {
    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const usuario = await User.findByPk(
            req.session.usuarioId,
            {
                include: [
                    {
                        model: Rol,
                        as: 'rol'
                    }
                ]
            }
        );

        if (!usuario) {
            return res.status(401).send(
                'Usuario no encontrado'
            );
        }

        if (!usuario.activo) {
            return res.status(403).send(
                'Usuario inactivo'
            );
        }

        if (!usuario.rol || usuario.rol.nombre !== 'validador') {
            return res.status(403).send(
                'No tenés permisos para acceder a esta sección'
            );
        }

        next();

    } catch (error) {
        console.error(
            'Error al verificar rol de validador:',
            error
        );

        next(error);
    }
};