import Valoracion from '../models/Valoracion.js';
import Imagen from '../models/Imagen.js';
import Publicacion from '../models/Publicacion.js';

export const crearValoracion = async (req, res) => {

    try {

        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const { imagen_id, valor } = req.body;

        const imagen = await Imagen.findByPk(imagen_id, {
            include: [{
                model: Publicacion,
                as: 'publicacion'
            }]
            
        });
        console.log(JSON.stringify(imagen, null, 2));
        if (!imagen) {
            return res.send('La imagen no existe');
        }

        if (imagen.publicacion.usuario_id === req.session.usuarioId) {
            return res.send(
                'No podés valorar tus propias imágenes'
            );
        }

        const valoracionExistente = await Valoracion.findOne({
            where: {
                usuario_id: req.session.usuarioId,
                imagen_id
            }
        });

        if (valoracionExistente) {
            return res.send(
                'Ya valoraste esta imagen'
            );
        }

        await Valoracion.create({
            usuario_id: req.session.usuarioId,
            imagen_id,
            valor
        });

        res.redirect('/');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            'Error al registrar la valoración'
        );
    }
};