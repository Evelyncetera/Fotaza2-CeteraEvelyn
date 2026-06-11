import Publicacion from "../models/Publicacion.js";
import Usuario from "../models/Usuario.js";
import Imagen from "../models/Imagen.js";
import Comentario from "../models/Comentario.js";
import Valoracion from "../models/Valoracion.js";
import Interes from '../models/Interes.js';

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
                        }
                    ]
                },
                {
                    model: Comentario,
                    as: 'comentarios',
                    include: [Usuario]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Para depurar 
        console.log(JSON.stringify(publicaciones, null, 2));
        const usuarioId = req.session ? req.session.usuarioId : null;

        console.log("Cantidad de publicaciones encontradas:", publicaciones.length);
        res.render('home', {
            publicaciones,
            usuarioLogueado: usuarioId,
            fotosmostradas: []
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el home");
    }
};
