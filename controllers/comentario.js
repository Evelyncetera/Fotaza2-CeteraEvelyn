import Comentario from '../models/Comentario.js';
import Imagen from "../models/Imagen.js";
import Publicacion from '../models/Publicacion.js';
import Notificacion from '../models/Notificacion.js';

export const crearComentario = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }
        const { texto, imagen_id } = req.body;

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
                req.session.mensaje ='La imagen no existe.';
                req.session.tipoMensaje ='warning';

                return res.redirect('/');
            }

            if (!imagen.comentarios_abiertos) {

                req.session.mensaje ='Los comentarios están cerrados para esta imagen.';
                req.session.tipoMensaje ='warning';

                return res.redirect('/');
            }

        await Comentario.create({
            texto,
            usuario_id: req.session.usuarioId,
            imagen_id
        });
        if (
            Number(imagen.publicacion.usuario_id) !==
            Number(req.session.usuarioId)
        ) {

            await Notificacion.create({

                usuario_id:
                    imagen.publicacion.usuario_id,

                actor_id:
                    req.session.usuarioId,

                tipo:
                    'comentario',

                publicacion_id:
                    imagen.publicacion.id,

                imagen_id:
                    imagen.id
            });
        }
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear comentario');
    }
};