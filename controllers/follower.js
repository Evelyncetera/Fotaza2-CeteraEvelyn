import { Op } from 'sequelize';

import Follower from '../models/Follower.js';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';
import Imagen from '../models/Imagen.js';
import Valoracion from '../models/Valoracion.js';
import Interes from '../models/Interes.js';
import Comentario from '../models/Comentario.js';
import Tag from '../models/Tag.js';
import Notificacion from '../models/Notificacion.js';

import '../models/PublicacionTag.js';

export const seguirUsuario = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const seguidor_id = req.session.usuarioId;
        const { seguido_id } = req.body;

        if (!seguido_id) {
            req.session.mensaje = 'Faltan datos.';
            req.session.tipoMensaje = 'warning';
            return res.redirect('/');
        }

        if (seguidor_id == seguido_id) {
            req.session.mensaje = 'No podés seguirte a vos mismo.';
            req.session.tipoMensaje = 'warning';
            return res.redirect('/');
        }

        const seguimientoExistente = await Follower.findOne({
            where: {
                seguidor_id,
                seguido_id
            }
        });

        if (seguimientoExistente) {
            req.session.mensaje = 'Ya seguís a este usuario.';
            req.session.tipoMensaje = 'warning';
            return res.redirect('/');
        }

        await Follower.create({
            seguidor_id,
            seguido_id
        });
        await Notificacion.create({
            usuario_id: seguido_id,
            actor_id: seguidor_id,
            tipo: 'seguimiento'
        });
        res.redirect('/');

    } catch (error) {

        console.error(error);

        req.session.mensaje = 'Error al seguir usuario.';
        req.session.tipoMensaje = 'danger';
        res.redirect('/');
    }
};


export const dejarDeSeguir = async (req, res) => {

    try {

        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const seguidor_id = req.session.usuarioId;
        const { seguido_id } = req.body;

        if (!seguido_id) {
            req.session.mensaje = 'Faltan datos.';
            req.session.tipoMensaje = 'warning';
            return res.redirect('/');
        }

        await Follower.destroy({
            where: {
                seguidor_id,
                seguido_id
            }
        });

        res.redirect('/');

    } catch (error) {

        console.error(error);

        req.session.mensaje = 'Error al dejar de seguir.';
        req.session.tipoMensaje = 'danger';
        res.redirect('/');
    }
};

export const mostrarPublicacionesSeguidos = async (req, res, next) => {

    try {

        const usuarioId =
            req.session.usuarioId;

        const seguimientos =
            await Follower.findAll({
                where: {
                    seguidor_id: usuarioId
                }
            });

        const seguidos =
            seguimientos.map(
                seguimiento =>
                    seguimiento.seguido_id
            );

        if (seguidos.length === 0) {

            return res.render('home', {
                publicaciones: [],
                seguidos: [],
                fotosmostradas: [],
                filtros: {},
                tituloFeed:
                    'Publicaciones de usuarios que sigo',
                mostrarBusqueda: false
            });
        }

        const publicaciones =
            await Publicacion.findAll({

                where: {
                    usuario_id: {
                        [Op.in]: seguidos
                    },
                    estado: 'publicada'
                },
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
                                include: [Usuario]
                            }
                        ]
                    }
                ],

                order: [
                    ['createdAt', 'DESC']
                ]
            });
        for (const publicacion of publicaciones) {

            for (const imagen of publicacion.imagenes || [] ) {

                const valoraciones =imagen.valoraciones || [];
                const cantidad =valoraciones.length;

                const suma =
                    valoraciones.reduce(
                        (total, valoracion) =>
                            total + valoracion.valor,
                        0
                    );

                const promedio = cantidad > 0 ? ( suma / cantidad).toFixed(1) : null;

                imagen.setDataValue('cantidadValoraciones', cantidad);
                imagen.setDataValue('promedioValoraciones', promedio);
            }
        }

        return res.render('home', {
            publicaciones,
            seguidos,
            fotosmostradas: [],
            filtros:{},
            tituloFeed: 'Publicaciones de usuarios que sigo',
            mostrarBusqueda: false
        });

    } catch (error) {

        next(error);
    }
};