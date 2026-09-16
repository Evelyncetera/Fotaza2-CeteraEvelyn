import Mensaje from '../models/Mensaje.js';
import Interes from '../models/Interes.js';
import Imagen from '../models/Imagen.js';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';


const obtenerInteresConParticipantes = async (interesId) => {

    return await Interes.findByPk(
        interesId,
        {
            include: [
                {
                    model: Usuario
                },
                {
                    model: Imagen,
                    include: [
                        {
                            model: Publicacion,
                            as: 'publicacion',
                            include: [
                                {
                                    model: Usuario
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    );
};


const usuarioPuedeParticipar = (
    interes,
    usuarioId
) => {

    if (!interes || !interes.Imagen?.publicacion) {
        return false;
    }

    const interesadoId = Number(interes.usuario_id);
    const autorId = Number(interes.Imagen.publicacion.usuario_id);
    const usuarioActualId = Number(usuarioId);

    return (
        usuarioActualId === interesadoId ||
        usuarioActualId === autorId
    );
};

export const mostrarConversacion =
    async (req, res, next) => {

        try {
            const usuarioId = req.session.usuarioId;

            const interes = await obtenerInteresConParticipantes(
                req.params.interesId
            );
            if (!interes) {

                req.session.mensaje ='El interés no existe.';
                req.session.tipoMensaje ='warning';
                return res.redirect('/');
            }
            if (
                !usuarioPuedeParticipar(
                    interes,
                    usuarioId
                )
            ) {
                req.session.mensaje ='No tenés acceso a esta conversación.';
                req.session.tipoMensaje ='danger';
                return res.redirect('/');
            }

            const mensajes = await Mensaje.findAll({
                    where: {
                        interes_id:
                            interes.id
                    },
                    include: [
                        {
                            model: Usuario,
                            as: 'remitente',
                            attributes: [
                                'id',
                                'nombre',
                                'apellido'
                            ]
                        }
                    ],

                    order: [
                        ['createdAt', 'ASC']
                    ]
                });
            const intereses = await obtenerConversacionesUsuario(
                    usuarioId
                );

            return res.render(
                'mensajes/conversacion',
                {
                    intereses,
                    interesActivo: interes,
                    mensajes,
                    usuarioId
                }
            );

        } catch (error) {
            next(error);
        }
    };


export const enviarMensaje = async (req, res, next) => {

        try {
            const usuarioId = req.session.usuarioId;

            const {texto} = req.body;

            const interes = await obtenerInteresConParticipantes(req.params.interesId);

            if (!interes) {

                req.session.mensaje ='El interés no existe.';
                req.session.tipoMensaje ='warning';
                return res.redirect('/');
            }

            if (!usuarioPuedeParticipar(interes, usuarioId)) {

                req.session.mensaje ='No tenés permiso para enviar mensajes en esta conversación.';
                req.session.tipoMensaje ='danger';

                return res.redirect('/');
            }

            if (!texto?.trim()) {

                req.session.mensaje ='El mensaje no puede estar vacío.';
                req.session.tipoMensaje ='warning';

                return res.redirect(`/mensajes/${interes.id}`);
            }

            await Mensaje.create({
                interes_id:
                    interes.id,
                remitente_id:
                    usuarioId,
                texto:
                    texto.trim()
            });
            return res.redirect(`/mensajes/${interes.id}`);

        } catch (error) {

            next(error);
        }
    };

    export const listarConversaciones = async (req, res, next) => {

    try {
        const usuarioId = req.session.usuarioId;
        const intereses = await obtenerConversacionesUsuario(
                    usuarioId
                );

        return res.render(
            'mensajes/conversacion',
            {
                intereses,
                interesActivo: null,
                mensajes: [],
                usuarioId
            }
        );
    } catch (error) {

        next(error);
    }
};

const obtenerConversacionesUsuario = async (usuarioId) => {

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
                                required: true,

                                include: [
                                    {
                                        model: Usuario,
                                        attributes: [
                                            'id',
                                            'nombre',
                                            'apellido',
                                            'avatar'
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],

                order: [
                    ['createdAt', 'DESC']
                ]
            });


        const usuarioActualId =
            Number(usuarioId);


        return intereses.filter(
            interes => {

                const interesadoId =
                    Number(interes.usuario_id);

                const autorId =
                    Number(
                        interes.Imagen
                            .publicacion
                            .usuario_id
                    );


                return (
                    interesadoId === usuarioActualId ||
                    autorId === usuarioActualId
                );
            }
        );
    };