import Interes from '../models/Interes.js';
import Imagen from '../models/Imagen.js';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';
import Notificacion from '../models/Notificacion.js';

export const marcarInteres = async (req, res, next) => {

    try {
        const usuarioId = req.session.usuarioId;
        const { imagen_id } = req.body;

        const imagen = await Imagen.findByPk(
            imagen_id,
            {
                include: [
                    {
                        model: Publicacion,
                        as: 'publicacion'
                    }
                ]
            }
        );

        if (!imagen) {

            req.session.mensaje = 'La imagen no existe.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/');
        }

        if (Number(imagen.publicacion.usuario_id) === Number(usuarioId)) {

            req.session.mensaje = 'No podés marcar interés en tu propia imagen.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/');
        }


        const interesExistente =
            await Interes.findOne({
                where: {
                    usuario_id: usuarioId,
                    imagen_id
                }
            });

        if (interesExistente) {

            await interesExistente.destroy();
            req.session.mensaje = 'Ya no estás interesado en esta imagen.';

        } else {
            await Interes.create({
                usuario_id: usuarioId,
                imagen_id
            });
            await Notificacion.create({
                usuario_id: imagen.publicacion.usuario_id,
                actor_id: usuarioId,
                tipo:'interes',
                publicacion_id: imagen.publicacion.id,
                imagen_id:imagen.id
            });
            req.session.mensaje ='Marcaste interés en esta imagen.';
        }
        req.session.tipoMensaje = 'success';

        res.redirect('/');

    } catch (error) {

        next(error);
    }
};
export const mostrarInteresados = async (req, res, next) => {

    try {

        const usuarioId = req.session.usuarioId;

        const intereses = await Interes.findAll({
                include: [
                    {
                        model: Usuario,
                        attributes: [
                            'id',
                            'nombre',
                            'apellido',
                            'avatar'
                        ]
                    },
                    {
                        model: Imagen,
                        required: true,
                        include: [
                            {
                                model: Publicacion,
                                as: 'publicacion',
                                where: {
                                    usuario_id:
                                        usuarioId
                                },
                                required: true
                            }
                        ]
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            });
        return res.render(
            'interesados',
            {
                intereses
            }
        );
    } catch (error) {

        next(error);
    }
};