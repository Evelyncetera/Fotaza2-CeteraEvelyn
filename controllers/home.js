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
        //Relevancia 
        for (const publicacion of publicaciones) {
            
            let cantidadTotal = 0;
            let sumaTotal = 0;

            for (const imagen of publicacion.imagenes || []) {

                for (const valoracion of imagen.valoraciones || []) {

                    cantidadTotal++;
                    sumaTotal += valoracion.valor;
                }
            }
            const promedioGeneral = cantidadTotal > 0 ? sumaTotal / cantidadTotal : 0;
            const destacada = cantidadTotal >= 3 && promedioGeneral >= 4;

            publicacion.setDataValue('cantidadValoraciones', cantidadTotal);
            publicacion.setDataValue('promedioValoraciones', promedioGeneral);
            publicacion.setDataValue('destacada', destacada);
        }

        const destacadas = publicaciones.filter(
                publicacion =>
                    publicacion.getDataValue('destacada')
            );
        const normales = publicaciones.filter(
                publicacion =>
                    !publicacion.getDataValue('destacada')
            );

        const publicacionesOrdenadas = [];
        let indiceDestacadas = 0;
        let indiceNormales = 0;

        while (indiceDestacadas < destacadas.length || indiceNormales < normales.length) {

            // Hasta 2 destacadas
            for (let i = 0; i < 2 && indiceDestacadas < destacadas.length; i++) {

                publicacionesOrdenadas.push(destacadas[indiceDestacadas]);
                indiceDestacadas++;
            }
            // despuès 1 normal
            if (indiceNormales < normales.length) {

                publicacionesOrdenadas.push(
                    normales[indiceNormales]
                );
                indiceNormales++;
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
            publicaciones: publicacionesOrdenadas,
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
