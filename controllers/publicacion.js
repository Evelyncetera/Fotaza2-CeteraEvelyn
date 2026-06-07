import Publicacion from '../models/Publicacion.js';

export const mostrarFormulario = (req, res) => {
    res.render('publicacion');
};

export const crearPublicacion = async (req, res) => {

    const {
        titulo,
        descripcion,
        comentarios_abiertos
    } = req.body;

    try {

        await Publicacion.create({
            usuario_id: 1, // de prueba
            titulo,
            descripcion,
            comentarios_abiertos: comentarios_abiertos ? true : false
        });

        res.redirect('/');

    } catch(error) {

        console.error(error);

        res.send('Error al crear publicación');
    }
};