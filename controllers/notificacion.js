import Notificacion from '../models/Notificacion.js';
import Usuario from '../models/Usuario.js';
import Publicacion from '../models/Publicacion.js';


export const listarNotificaciones = async (req, res, next) => {

    try {

        const notificaciones =
            await Notificacion.findAll({

                where: {
                    usuario_id:
                        req.session.usuarioId
                },

                include: [
                    {
                        model: Usuario,
                        as: 'actor',
                        attributes: [
                            'id',
                            'nombre',
                            'apellido',
                            'avatar'
                        ]
                    },
                    {
                        model: Publicacion,
                        as: 'publicacion',
                        attributes: [
                            'id',
                            'titulo'
                        ]
                    }
                ],

                order: [
                    ['createdAt', 'DESC']
                ]
            });


        return res.render(
            'notificaciones',
            {
                notificaciones
            }
        );

    } catch (error) {

        next(error);
    }
};


export const abrirNotificacion = async (req, res, next) => {

    try {

        const notificacion =
            await Notificacion.findOne({

                where: {
                    id: req.params.id,
                    usuario_id:
                        req.session.usuarioId
                }
            });


        if (!notificacion) {

            req.session.mensaje =
                'La notificación no existe.';

            req.session.tipoMensaje =
                'warning';

            return res.redirect(
                '/notificaciones'
            );
        }


        if (!notificacion.leida) {

            notificacion.leida = true;

            await notificacion.save();
        }


        if (
            notificacion.tipo ===
            'seguimiento'
        ) {

            return res.redirect(
                `/perfil/${notificacion.actor_id}`
            );
        }


        if (notificacion.publicacion_id) {

            return res.redirect(
                `/publicaciones/ver/${notificacion.publicacion_id}`
            );
        }
        return res.redirect('/');

    } catch (error) {
        next(error);
    }
};


export const marcarTodasLeidas =
    async (req, res, next) => {

        try {

            await Notificacion.update(
                {
                    leida: true
                },
                {
                    where: {
                        usuario_id:
                            req.session.usuarioId,
                        leida: false
                    }
                }
            );


            return res.redirect(
                '/notificaciones'
            );

        } catch (error) {

            next(error);
        }
    };