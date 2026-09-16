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
        } = req.body;

        if (!req.files || req.files.length === 0) {

            req.session.mensaje =
                'La publicación debe contener al menos una imagen.';

            req.session.tipoMensaje = 'warning';

            return res.redirect('/publicaciones/crear');
        }
        const normalizarArray = valor => {

            if (valor === undefined) {
                return [];
            }
            return Array.isArray(valor) ? valor : [valor];
        };

        const licencias = normalizarArray(req.body.licencias);
        const marcasAgua =normalizarArray(req.body.marcas_de_agua);
        const indicesComentarios =normalizarArray(req.body.comentarios_abiertos_indices);
        const comentariosAbiertos = new Set(indicesComentarios.map(Number));

        if (licencias.length !== req.files.length) {

            req.session.mensaje = 'No se pudo determinar la licencia de todas las imágenes.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/publicaciones/crear');
        }

        const licenciasValidas = ['sin_copyright', 'copyright'];
        const hayLicenciaInvalida = licencias.some( licencia => !licenciasValidas.includes(licencia));


        if (hayLicenciaInvalida) {

            req.session.mensaje ='Se detectó una licencia inválida.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/publicaciones/crear');
        }


        const nuevaPublicacion = await Publicacion.create({
                usuario_id: req.session.usuarioId,
                titulo,
                descripcion,
                comentarios_abiertos : true
            });

        

        for (let indice = 0; indice < req.files.length; indice++) {

            const archivo = req.files[indice];
            const licencia = licencias[indice];

            let archivoFinal = archivo.path;
            let marcaAgua = null;

                if (licencia === 'copyright') {
                    
                    marcaAgua = marcasAgua[indice]?.trim() || '© Fotaza 2';

                    archivoFinal = cloudinary.url(
                        archivo.filename,
                        {
                            secure: true,
                            transformation: [
                                {
                                    overlay: {
                                        font_family: 'Arial',
                                        font_size: 100,
                                        font_weight: 'bold',
                                        text: marcaAgua
                                    },
                                    color: 'black',
                                    opacity: 90
                                },
                                {
                                    width: 0.27,
                                    flags: 'relative'
                                },
                                {
                                    flags: 'layer_apply',
                                    gravity: 'south_east',
                                    x: 0.02,
                                    y: 0.02
                                },
                                {
                                    overlay: {
                                        font_family: 'Arial',
                                        font_size: 100,
                                        font_weight: 'bold',
                                        text: marcaAgua
                                    },
                                    color: 'white',
                                    opacity: 90
                                },
                                {
                                    width: 0.25,
                                    flags: 'relative'
                                },
                                {
                                    flags: 'layer_apply',
                                    gravity: 'south_east',
                                    x: 0.02,
                                    y: 0.02
                                }
                            ]
                        }
                    );
                }

                await Imagen.create({
                    publicacion_id: nuevaPublicacion.id,
                    archivo: archivoFinal,
                    licencia,
                    marca_de_agua: marcaAgua,
                    comentarios_abiertos: comentariosAbiertos.has(indice)
                });
        }

        req.session.mensaje = 'Publicación creada correctamente.';
        req.session.tipoMensaje ='success';
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