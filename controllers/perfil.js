import Usuario from '../models/Usuario.js';
import Publicacion from '../models/Publicacion.js';
import Imagen from '../models/Imagen.js';
import Follower from '../models/Follower.js';
import Valoracion from '../models/Valoracion.js';
import Interes from '../models/Interes.js';
import Comentario from '../models/Comentario.js';

export const mostrarPerfil = async (req, res) => {

    try {

        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const usuario = await Usuario.findByPk(
            req.session.usuarioId
        );

        const publicaciones = await Publicacion.findAll({
            where: {
                usuario_id: req.session.usuarioId
            },
            include: [
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
                            as: 'comentarios'
                        }
                    ]
                },
            ]
        });

        const seguidores = await Follower.count({
            where: {
                seguido_id: req.session.usuarioId
            }
        });

        const seguidos = await Follower.count({
            where: {
                seguidor_id: req.session.usuarioId
            }
        });

        for (const publicacion of publicaciones) {
            if (publicacion.imagenes && publicacion.imagenes.length > 0) {
                const valoraciones = publicacion.imagenes[0].valoraciones || [];

                if (valoraciones.length > 0) {
                    const suma = valoraciones.reduce((acc, val) => acc + val.valor, 0);
                    publicacion.promedioValoraciones = (suma / valoraciones.length).toFixed(1);
                } else {
                    publicacion.promedioValoraciones = "Sin valorar";
                }
            } else {
                publicacion.promedioValoraciones = "Sin imagen";
            }
        }


        res.render('perfil', {
            usuario,
            publicaciones,
            seguidores,
            seguidos
        });

    } catch (error) {

        console.error(error);

        res.status(500).send(
            'Error al cargar el perfil'
        );
    }
};
export const mostrarPerfilPublico = async (req, res, next) => {

    try {
        const usuario = await Usuario.findByPk(
                req.params.id,
                {
                    attributes: [
                        'id',
                        'nombre',
                        'apellido',
                        'avatar'
                    ]
                }
            );

        if (!usuario) {

            req.session.mensaje = 'El usuario no existe.';
            req.session.tipoMensaje = 'warning';
            return res.redirect('/');
        }

        const publicaciones = await Publicacion.findAll({
                where: {
                    usuario_id:
                        usuario.id
                },
                include: [
                    {
                        model: Imagen,
                        as: 'imagenes'
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
            });

        const seguidores =
            await Follower.count({
                where: {
                    seguido_id:
                        usuario.id
                }
            });

        const seguidos =
            await Follower.count({
                where: {
                    seguidor_id:
                        usuario.id
                }
            });

        return res.render(
            'perfilPublico',
            {
                usuario,
                publicaciones,
                seguidores,
                seguidos
            }
        );
    } catch (error) {

        next(error);
    }
};