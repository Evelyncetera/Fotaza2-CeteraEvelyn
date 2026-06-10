import { Op } from 'sequelize';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';
import Imagen from '../models/Imagen.js';

export const buscarPublicaciones = async (req, res) => {

    try {
        const { titulo, fecha } = req.query;
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
                    as: 'imagenes'
                }
            ],

            order: [['createdAt', 'DESC']]
        });
        console.log('SESSION EN BUSQUEDA:', req.session);
        res.render('home', {
            publicaciones,
            usuarioLogueado: req.session.usuario_id
        });

    } catch(error) {

        console.error(error);

        res.send('Error al realizar la búsqueda');
    }
};

