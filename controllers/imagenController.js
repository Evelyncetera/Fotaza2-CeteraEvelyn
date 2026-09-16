import Imagen from '../models/Imagen.js';
import Publicacion from '../models/Publicacion.js';

export const alternarComentarios = async (req, res, next) => {

    try {

        const usuarioId =
            req.session.usuarioId;

        const imagen = await Imagen.findByPk(
                req.params.id,
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


        // Habilitado solo para el autor
        if (imagen.publicacion.usuario_id !== usuarioId) {

            req.session.mensaje = 'No tenés permisos para modificar los comentarios de esta imagen.';
            req.session.tipoMensaje = 'danger';

            return res.redirect('/');
        }


        const nuevoEstado = !imagen.comentarios_abiertos;

        await imagen.update({comentarios_abiertos: nuevoEstado});

        req.session.mensaje = nuevoEstado ? 'Los comentarios fueron habilitados.' : 'Los comentarios fueron cerrados.';
        req.session.tipoMensaje ='success';

        return res.redirect('/');

    } catch (error) {

        next(error);
    }
};