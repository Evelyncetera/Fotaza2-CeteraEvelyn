import Publicacion from "../models/Publicacion.js";
import Usuario from "../models/Usuario.js";
import Imagen from "../models/Imagen.js";
import Comentario from "../models/Comentario.js";
import Valoracion from "../models/Valoracion.js";
import Interes from '../models/Interes.js';
import Follower from '../models/Follower.js';

export const mostrarHome = async (req, res) => {
    try {
        const publicaciones = await Publicacion.findAll({

            include: [
                Usuario,
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
            order: [['createdAt', 'DESC']]
        });
        
        const usuarioId = req.session?.usuarioId || null;
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
            fotosmostradas: []
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el home");
    }
};
