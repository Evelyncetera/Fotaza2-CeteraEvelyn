import Publicacion from '../models/Publicacion.js';
import Imagen from '../models/Imagen.js';
import cloudinary from '../middlewares/cloudinary.js'

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
            comentarios_abiertos,
            licencia,
            marca_de_agua
        } = req.body;

        if (licencia !== 'sin_copyright' && licencia !== 'copyright') {
            
            req.session.mensaje = 'Debés seleccionar una licencia válida.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/publicaciones/crear');
        }

        const nuevaPublicacion = await Publicacion.create({
            usuario_id: req.session.usuarioId,
            titulo,
            descripcion,
            comentarios_abiertos: comentarios_abiertos ? true : false
        });

        if (req.file) {

            let archivoFinal = req.file.path;
            let marcaAgua = null;

                if (licencia === 'copyright') {
                    
                    marcaAgua = marca_de_agua?.trim() || '© Fotaza 2';

                    archivoFinal = cloudinary.url(
                        req.file.filename,
                        {
                            secure: true,
                            transformation: [
                                {
                                    overlay: {
                                        font_family: 'Arial',
                                        font_size: 40,
                                        font_weight: 'bold',
                                        text: marcaAgua
                                    },
                                    color: 'white',
                                    opacity: 70
                                },
                                {
                                    gravity: 'south_east',
                                    x: 20,
                                    y: 20
                                }
                            ]
                        }
                    );
                }

                await Imagen.create({
                    publicacion_id: nuevaPublicacion.id,
                    archivo: req.file.path,
                    licencia,
                    marca_de_agua: marcaAgua
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