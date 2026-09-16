import Publicacion from "../models/Publicacion.js";
import Usuario from "../models/Usuario.js";
import Imagen from "../models/Imagen.js";
import Comentario from "../models/Comentario.js";
import Valoracion from "../models/Valoracion.js";
import Interes from '../models/Interes.js';
import Follower from '../models/Follower.js';
import Tag from '../models/Tag.js';
import Coleccion from '../models/Coleccion.js';
import '../models/PublicacionTag.js';

export const mostrarHome = async (req, res) => {
    try {
        const usuarioId = req.session?.usuarioId || null;

        let coleccionesUsuario = [];
        if (usuarioId) {
            coleccionesUsuario = await Coleccion.findAll({
                where: {
                    usuario_id: usuarioId
                },
                order: [
                    ['nombre', 'ASC']
                ]
            });
        }

        const publicaciones = await Publicacion.findAll({

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

        for (const publicacion of publicaciones) {

            for (const imagen of publicacion.imagenes || []) {

                const valoraciones = imagen.valoraciones || [];
                const cantidad = valoraciones.length;
                const suma = valoraciones.reduce((total, valoracion) => total + valoracion.valor, 0);
                const promedio = cantidad > 0 ? (suma / cantidad).toFixed(1): null;

                imagen.setDataValue('cantidadValoraciones',cantidad);
                imagen.setDataValue('promedioValoraciones',promedio);
            }
        }

        let seguidos = [];

        if (usuarioId) {
            
            const seguimientos = await Follower.findAll({
                where: {
                    seguidor_id: usuarioId
                }
            });
            seguidos = seguimientos.map(
                seguimiento => seguimiento.seguido_id
            );
        }

        /* para debug
        
        console.log(
            JSON.stringify(publicaciones[0], null, 2)
        );*/

        
        res.render('home', {
            publicaciones,
            seguidos,
            fotosmostradas: [],
            filtros: {},
            tituloFeed: 'Feed',
            mostrarBusqueda: true,
            coleccionesUsuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el home");
    }
};
