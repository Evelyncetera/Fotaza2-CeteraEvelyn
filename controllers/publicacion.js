import Publicacion from '../models/Publicacion.js';
import Imagen from '../models/Imagen.js';
import Valoracion from '../models/Valoracion.js';
import Interes from '../models/Interes.js';
import Comentario from '../models/Comentario.js';
import Tag from '../models/Tag.js';
import Usuario from '../models/Usuario.js';
import cloudinary from '../middlewares/cloudinary.js';
import '../models/PublicacionTag.js';



export const mostrarPublicacion = async (req, res, next) => {
    try {
        const usuarioId = req.session.usuarioId;
        const publicacion = await Publicacion.findByPk(
                req.params.id,
                {
                    include: [
                        Usuario,
                        {
                            model: Tag,
                            as: 'tags',
                            through: {
                                attributes: []
                            }
                        },
                        {
                            model: Imagen,
                            as: 'imagenes',
                            include: [
                                {
                                    model: Valoracion,
                                    as: 'valoraciones'
                                },
                                {
                                    model: Interes,
                                    as: 'intereses'
                                },
                                {
                                    model: Comentario,
                                    as: 'comentarios',
                                    include: [
                                        Usuario
                                    ]
                                }
                            ]
                        }
                    ]
                }
            );
        if (!publicacion) {
            req.session.mensaje ='La publicación no existe.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/');
        }

        for (const imagen of publicacion.imagenes || []) {

            const valoraciones = imagen.valoraciones || [];
            const cantidad = valoraciones.length;
            const suma = valoraciones.reduce(
                    (total, valoracion) =>
                        total + valoracion.valor,
                    0
                );

            const promedio = cantidad > 0 ? (suma / cantidad).toFixed(1) : null;

            imagen.setDataValue('cantidadValoraciones', cantidad);
            imagen.setDataValue('promedioValoraciones', promedio);
        }
        return res.render(
            'home',
            {
                publicaciones: [
                    publicacion
                ],
                seguidos: [],
                fotosmostradas: [],
                filtros: {},
                tituloFeed:'Publicación',
                mostrarBusqueda: false,
                vistaDetalle: true
            }
        );
    } catch (error) {
        next(error);
    }
};

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
            tags
        } = req.body;

        const nombresTags = (tags || '')
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0);

        const tagsUnicos = [
            ...new Set(nombresTags)
        ];

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

        if (tagsUnicos.length === 0) {

            req.session.mensaje = 'La publicación debe contener al menos una etiqueta.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/publicaciones/crear');
        }

        const tagDemasiadoLargo = tagsUnicos.some(tag => tag.length > 50);

        if (tagDemasiadoLargo) {
            req.session.mensaje ='Las etiquetas no pueden superar los 50 caracteres.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/publicaciones/crear');
        }

        const nuevaPublicacion = await Publicacion.create({
                usuario_id: req.session.usuarioId,
                titulo,
                descripcion,
                comentarios_abiertos : true
            });

        const tagAsociados =[];
        for(const nombre of tagsUnicos){
            const[tag] = await Tag.findOrCreate({
                where: {
                    nombre
                },
                defaults: {
                    nombre
                }
            });
            tagAsociados.push(tag);
            }
        
        await nuevaPublicacion.setTags(tagAsociados);

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