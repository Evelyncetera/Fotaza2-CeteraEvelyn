import { Op } from 'sequelize';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';
import Imagen from '../models/Imagen.js';
import Follower from '../models/Follower.js';
import Valoracion from '../models/Valoracion.js';
import Interes from '../models/Interes.js';
import Comentario from '../models/Comentario.js';


export const buscarPublicaciones = async (req, res) => {

    try {
        const { titulo, fecha } = req.query;
        const usuarioId = req.session?.usuarioId || null;

        const where = {};

        if (titulo) {
            where.titulo = {
                [Op.iLike]: `%${titulo}%`
            };
        }
        if (fecha) {
            where.createdAt = {
                [Op.gte]: new Date(fecha),
                [Op.lt]: new Date(
                    new Date(fecha).setDate(
                        new Date(fecha).getDate() + 1
                    )
                )
            };
        }
        const publicaciones = await Publicacion.findAll({
            where,
            include: [
                Usuario,
                {
                    model: Imagen,
                    as: 'imagenes',
                    ...(usuarioId ? {} : {
                            where: {
                                licencia: 'sin_copyright'
                            },
                            required: true
                        }
                    ),
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
            order: [['createdAt', 'DESC']]
        });

        
        let seguidos = [];

            if (usuarioId) {

                const seguimientos = await Follower.findAll({
                    where: {
                        seguidor_id: usuarioId
                    }
                });

                seguidos = seguimientos.map( seguimiento => seguimiento.seguido_id);
            }


        res.render('home', {
            publicaciones,
            seguidos,
            fotosmostradas: []
        });

    } catch(error) {

        console.error(error);

        res.status(500).send('Error al realizar la búsqueda');
    }
};

