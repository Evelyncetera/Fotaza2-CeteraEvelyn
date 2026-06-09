import Publicacion from '../models/Publicacion.js';

export const mostrarFormulario = (req, res) => {
    res.render('publicacion');
};

export const crearPublicacion = async (req, res) => {
    console.log('SESSION:', req.session);
    console.log('USUARIO ID:', req.session.usuarioId);
    try {
        if(!req.session.usuarioId){
            return res.redirect('/auth/login');
        }

        const {
            titulo,
            descripcion,
            comentarios_abiertos
        } = req.body;

        const nombreImagen = req.file ? req.file.filename : null;


        await Publicacion.create({
            usuario_id: req.session.usuarioId,
            titulo,
            descripcion,
            comentarios_abiertos: comentarios_abiertos ? true : false
        });

        res.redirect('/');

    } catch (error) {

        console.error(error);

        res.status(500).send('Error al crear publicación');
    }
};