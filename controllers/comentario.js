import Comentario from '../models/Comentario.js';
import Imagen from "../models/Imagen.js";

export const crearComentario = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }
        const { texto, imagen_id } = req.body;

        const imagen = await Imagen.findByPk(imagen_id);

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
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear comentario');
    }
};