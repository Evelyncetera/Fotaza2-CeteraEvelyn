import { Op } from 'sequelize';

import Follower from '../models/Follower.js';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';
import Imagen from '../models/Imagen.js';
import Valoracion from '../models/Valoracion.js';
import Interes from '../models/Interes.js';
import Comentario from '../models/Comentario.js';
import Tag from '../models/Tag.js';

import '../models/PublicacionTag.js';

export const seguirUsuario = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const seguidor_id = req.session.usuarioId;
        const { seguido_id } = req.body;

        if (seguidor_id == seguido_id) {
            return res.send(
                'No podés seguirte a vos mismo'
            );
        }

        const seguimientoExistente = await Follower.findOne({
            where: {
                seguidor_id,
                seguido_id
            }
        });

        if (seguimientoExistente) {
            return res.send(
                'Ya seguís a este usuario'
            );
        }

        await Follower.create({
            seguidor_id,
            seguido_id
        });

        res.redirect('/');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            'Error al seguir usuario'
        );
    }
};


export const dejarDeSeguir = async (req, res) => {

    try {

        const seguidor_id = req.session.usuarioId;
        const { seguido_id } = req.body;

        await Follower.destroy({
            where: {
                seguidor_id,
                seguido_id
            }
        });

        res.redirect('/');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            'Error al dejar de seguir'
        );
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
                    }
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