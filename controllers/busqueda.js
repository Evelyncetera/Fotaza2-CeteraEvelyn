import { Op } from 'sequelize';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';
import Imagen from '../models/Imagen.js';
import Follower from '../models/Follower.js';
import Valoracion from '../models/Valoracion.js';
import Interes from '../models/Interes.js';
import Comentario from '../models/Comentario.js';
import Tag from '../models/Tag.js';
import '../models/PublicacionTag.js';


export const buscarPublicaciones = async (req, res) => {

    try {
        const { titulo, fecha, autor, tag, licencia } = req.query;
        const usuarioId = req.session?.usuarioId || null;

        const wherePubli = {};

        if (titulo?.trim()) {
            wherePubli.titulo = {[Op.iLike]: `%${titulo.trim()}%`};
        };

        if (fecha) {

            const inicio = new Date(`${fecha}T00:00:00-03:00`);
            const fin = new Date (`${fecha}T23:59:59.999-03:00`);

            fin.setDate(fin.getDate() + 1);

            wherePubli.createdAt = {
                [Op.gte]: inicio,
                [Op.lte]: fin
            };
        }
        const includeUsuario = {model: Usuario};

        if (autor?.trim()) {

            includeUsuario.where = {
                [Op.or]: [
                    {
                        nombre: {
                            [Op.iLike]:
                                `%${autor.trim()}%`
                        }
                    },
                    {
                        apellido: {
                            [Op.iLike]:
                                `%${autor.trim()}%`
                        }
                    }
                ]
            };

            includeUsuario.required = true;
        }

        const includeTag = {
            model: Tag,
            as: 'tags',

            through: {
                attributes: []
            }
        };

        if (tag?.trim()) {

            const tagBuscado = tag.trim();

            includeTag.where = {
                nombre: {
                    [Op.iLike]: `%${tagBuscado}%`
                }
            };

            includeTag.required = true;
        }
        const whereImagen = {}

        if (!usuarioId) {
            
            whereImagen.licencia = 'sin_copyright';

        } else if ( licencia === 'copyright' || licencia === 'sin_copyright') {

            whereImagen.licencia = licencia;
        }
        const includeImagen = {

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
        };

        if (
            Object.keys(whereImagen).length > 0
        ) {
            includeImagen.where = whereImagen;
            includeImagen.required = true;
        }

        const publicaciones = await Publicacion.findAll({
            where: wherePubli,
            include: [
                includeUsuario,
                includeTag,
                includeImagen
                ],

                order: [
                    ['createdAt', 'DESC']
                ],

                distinct: true
            });

        for (const publicacion of publicaciones) {

            for (const imagen of publicacion.imagenes || []) {

                const valoraciones = imagen.valoraciones || [];
                const cantidad = valoraciones.length;


                const suma = valoraciones.reduce(
                        (total, valoracion) => total + valoracion.valor, 0);


                const promedio = cantidad > 0 ? (suma / cantidad).toFixed(1) : null;

                imagen.setDataValue('cantidadValoraciones', cantidad);
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

                seguidos = seguimientos.map( seguimiento => seguimiento.seguido_id);
            }


        res.render('home', {
            publicaciones,
            seguidos,
            fotosmostradas: [],
            filtros: {
                titulo,
                autor,
                tag,
                fecha,
                licencia
            }
        });

    } catch(error) {

        console.error(error);

        res.status(500).send('Error al realizar la búsqueda');
    }
};

