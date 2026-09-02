import User from '../models/Usuario.js';
import Rol from '../models/Rol.js';

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