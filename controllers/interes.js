import Interes from '../models/Interes.js';
import Imagen from '../models/Imagen.js';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';

export const marcarInteres = async (req, res) => {

    try {
        const usuarioId = req.session.usuarioId;
        const { imagen_id } = req.body;

        const imagen = await Imagen.findByPk(
            imagen_id,
            {
                include: [
                    {
                        model: Publicacion,
                        as: 'publicacion'
                    }
                ]
            }
        );

        if (!imagen) {

            req.session.mensaje = 'La imagen no existe.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/');
        }

        const interesExistente = await Interes.findOne({
            where: {
                usuario_id: req.session.usuarioId,
                imagen_id
            }
        });

        if (interesExistente) {

            await interesExistente.destroy();
            req.session.mensaje = 'Ya no estás interesado en esta imagen.';

        } else {
            await Interes.create({
                usuario_id: usuarioId,
                imagen_id
            });

            req.session.mensaje ='Marcaste interés en esta imagen.';
        }
        req.session.tipoMensaje = 'success';

        res.redirect('/');

    } catch (error) {

        next(error);
    }
};
export const mostrarInteresados = async (req, res, next) => {

    try {

        const usuarioId = req.session.usuarioId;

        const intereses = await Interes.findAll({
                include: [
                    {
                        model: Usuario,
                        attributes: [
                            'id',
                            'nombre',
                            'apellido',
                            'avatar'
                        ]
                    },
                    {
                        model: Imagen,
                        required: true,
                        include: [
                            {
                                model: Publicacion,
                                as: 'publicacion',
                                where: {
                                    usuario_id:
                                        usuarioId
                                },
                                required: true
                            }
                        ]
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            });
        return res.render(
            'interesados',
            {
                intereses
            }
        );
    } catch (error) {

        next(error);
    }
};