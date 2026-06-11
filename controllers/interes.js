import Interes from '../models/Interes.js';

export const marcarInteres = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }
        const { imagen_id } = req.body;
        const interesExistente = await Interes.findOne({
            where: {
                usuario_id: req.session.usuarioId,
                imagen_id
            }
        });

        if (interesExistente) {
            await interesExistente.destroy();
        } else {
            await Interes.create({
                usuario_id: req.session.usuarioId,
                imagen_id
            });

        }
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send(
            'Error al registrar interés'
        );
    }
};