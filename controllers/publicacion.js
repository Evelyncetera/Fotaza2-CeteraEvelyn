import Publicacion from '../models/Publicacion.js';
import Imagen from '../models/Imagen.js';

export const mostrarFormulario = (req, res) => {
    res.render('publicacion');
};

export const crearPublicacion = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const {
            titulo,
            descripcion,
            comentarios_abiertos
        } = req.body;

        const nombreImagen = req.file ? req.file.filename : null;

        const nuevaPublicacion = await Publicacion.create({
            usuario_id: req.session.usuarioId,
            titulo,
            descripcion,
            comentarios_abiertos: comentarios_abiertos ? true : false
        });

        if (req.file) {
            await Imagen.create({
                publicacion_id: nuevaPublicacion.id,
                archivo: req.file.filename
            });
        }

        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear publicación');
    }
};

export const eliminarPublicacion = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }
        const publicacion = await Publicacion.findByPk(
            req.params.id
        );

        if (!publicacion) {
            return res.send(
                'La publicación no existe'
            );
        }

        if (
            publicacion.usuario_id !==
            req.session.usuarioId
        ) {
            return res.send(
                'No tenés permisos para eliminar esta publicación'
            );
        }
        await publicacion.update({
            estado: 'eliminada'
        });
        
        await publicacion.destroy();
        res.redirect('/');

    } catch (error) {

        console.error(error);
        res.status(500).send(
            'Error al eliminar la publicación'
        );
    }
};