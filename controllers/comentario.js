import Comentario from '../models/Comentario.js';

export const crearComentario = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }
        const { texto, imagen_id } = req.body;

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