import Coleccion from '../models/Coleccion.js';
import ColeccionPublicacion from '../models/ColeccionPublicacion.js';
import Publicacion from '../models/Publicacion.js';
import Imagen from '../models/Imagen.js';
import Usuario from '../models/Usuario.js';


export const listarColecciones = async (req, res, next) => {
    try {

        const usuarioId = req.session.usuarioId;
        const colecciones = await Coleccion.findAll({
            where: {
                usuario_id: usuarioId
            },
            include: [
                {
                    model: Publicacion,
                    as: 'publicaciones',
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: Imagen,
                            as: 'imagenes'
                        }
                    ]
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });

        return res.render(
            'colecciones',
            {
                colecciones
            }
        );
    } catch (error) {
        next(error);
    }
};

export const mostrarColeccion = async (req, res, next) => {
    try {
        const usuarioId = req.session.usuarioId;
        const coleccion = await Coleccion.findOne({
            where: {
                id: req.params.id,
                usuario_id: usuarioId
            },
            include: [
                {
                    model: Publicacion,
                    as: 'publicaciones',
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: Imagen,
                            as: 'imagenes'
                        }
                    ]
                }
            ]
        });
        if (!coleccion) {
            req.session.mensaje = 'La colección no existe o no tenés acceso.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/colecciones');
        }
        return res.render('coleccionDetalle',{coleccion});

    } catch (error) {
        next(error);
    }
};

export const crearColeccion = async (req, res, next) => {
    try {
        const usuarioId = req.session.usuarioId;
        const nombre = req.body.nombre?.trim();

        if (!nombre) {

            req.session.mensaje ='Ingresá un nombre para la colección.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/colecciones');
        }
        const coleccionExistente = await Coleccion.findOne({
                where: {
                    usuario_id: usuarioId,
                    nombre
                }
            });
        if (coleccionExistente) {

            req.session.mensaje ='Ya tenés una colección con ese nombre.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/colecciones');
        }
        await Coleccion.create({
            usuario_id: usuarioId,
            nombre
        });
        req.session.mensaje ='Colección creada correctamente.';
        req.session.tipoMensaje ='success';

        return res.redirect('/colecciones');

    } catch (error) {

        next(error);
    }
};

export const agregarPublicacion = async (req, res, next) => {
    try {
        const usuarioId = req.session.usuarioId;
        const {coleccion_id, publicacion_id} = req.body;

        const coleccion = await Coleccion.findOne({
                where: {
                    id: coleccion_id,
                    usuario_id: usuarioId
                }
            });
        if (!coleccion) {
            req.session.mensaje ='La colección no existe o no te pertenece.';
            req.session.tipoMensaje ='danger';

            return res.redirect('/');
        }
        const publicacion = await Publicacion.findByPk(publicacion_id);

        if (!publicacion) {
            req.session.mensaje ='La publicación no existe.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/');
        }
        const existente = await ColeccionPublicacion.findOne({
                where: {
                    coleccion_id: coleccion.id,
                    publicacion_id: publicacion.id
                }
            });


        if (existente) {

            req.session.mensaje ='Esta publicación ya está guardada en esa colección.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/');
        }
        await ColeccionPublicacion.create({
            coleccion_id: coleccion.id,
            publicacion_id:publicacion.id
        });

        req.session.mensaje =`Publicación guardada en "${coleccion.nombre}".`;
        req.session.tipoMensaje = 'success';

        return res.redirect('/');

    } catch (error) {

        next(error);
    }
};

export const quitarPublicacion = async (req, res, next) => {
    try {
        const usuarioId = req.session.usuarioId;

        const {coleccion_id, publicacion_id} = req.body;

        const coleccion = await Coleccion.findOne({
                where: {
                    id: coleccion_id,
                    usuario_id: usuarioId
                }
            });

        if (!coleccion) {

            req.session.mensaje ='La colección no existe o no te pertenece.';
            req.session.tipoMensaje ='danger';

            return res.redirect('/colecciones');
        }

        await ColeccionPublicacion.destroy({
            where: {
                coleccion_id,
                publicacion_id
            }
        });

        req.session.mensaje ='Publicación eliminada de la colección.';
        req.session.tipoMensaje ='success';

        return res.redirect(`/colecciones/${coleccion.id}`);

    } catch (error) {

        next(error);
    }
};

export const toggleFavorito = async (req, res, next) => {
    try {

        const usuarioId = req.session.usuarioId;
        const {publicacion_id} = req.body;

        const publicacion = await Publicacion.findByPk(publicacion_id);


        if (!publicacion) {

            req.session.mensaje ='La publicación no existe.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/');
        }

        const [
            favoritos
        ] = await Coleccion.findOrCreate({
            where: {
                usuario_id: usuarioId,
                nombre: 'Favoritos'
            },
            defaults: {
                usuario_id: usuarioId,
                nombre:'Favoritos'
            }
        });

        const favoritoExistente = await ColeccionPublicacion.findOne({
                where: {
                    coleccion_id: favoritos.id,
                    publicacion_id:publicacion.id
                }
            });

        if (favoritoExistente) {

            await favoritoExistente.destroy();
            req.session.mensaje = 'Publicación eliminada de favoritos.';

        } else {

            await ColeccionPublicacion.create({
                coleccion_id: favoritos.id,
                publicacion_id: publicacion.id
            });

            req.session.mensaje ='Publicación guardada en favoritos.';
        }
        req.session.tipoMensaje ='success';
        return res.redirect('/');

    } catch (error) {
        next(error);
    }
};