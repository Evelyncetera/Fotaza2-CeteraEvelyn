import Valoracion from '../models/Valoracion.js';
import Imagen from '../models/Imagen.js';
import Publicacion from '../models/Publicacion.js';
import Notificacion from '../models/Notificacion.js';

export const crearValoracion = async (req, res) => {

    try {

        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const { imagen_id, valor } = req.body;
        const valorNumerico = Number(valor);

        if (!Number.isInteger(valorNumerico) || valorNumerico < 1 || valorNumerico > 5) {

            req.session.mensaje = 'La valoración debe estar entre 1 y 5.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/');
        }

        const imagen = await Imagen.findByPk(imagen_id, {
            include: [{
                model: Publicacion,
                as: 'publicacion'
            }]
            
        });

        if (!imagen) {
            req.session.mensaje = 'La imagen no existe.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/');
        }

        if (imagen.publicacion.usuario_id === req.session.usuarioId) {
            req.session.mensaje =  'No podés valorar tus propias imágenes.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/');
        }

        const valoracionExistente = await Valoracion.findOne({
            where: {
                usuario_id: req.session.usuarioId,
                imagen_id
            }
        });

        if (valoracionExistente) {
            req.session.mensaje =  'Ya valoraste esta imagen.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/');
        }

        await Valoracion.create({
            usuario_id: req.session.usuarioId,
            imagen_id,
            valor: valorNumerico
        });
        await Notificacion.create({
            usuario_id: imagen.publicacion.usuario_id,
            actor_id: req.session.usuarioId,
            tipo:'valoracion',
            publicacion_id: imagen.publicacion.id,
            imagen_id: imagen.id
        });
        
        req.session.mensaje =  'Valoración registrada correctamente.';
        req.session.tipoMensaje = 'success';

        return res.redirect('/');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            'Error al registrar la valoración'
        );
    }
};