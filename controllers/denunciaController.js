import DenunciaImagen from "../models/DenunciaImagen.js";
import DenunciaComentario from "../models/DenunciaComentarios.js";
import Imagen from "../models/Imagen.js";
import Comentario from "../models/Comentario.js";
import Publicacion from "../models/Publicacion.js";
import Usuario from "../models/Usuario.js";

export const denunciarImagen = async (req, res) => {
    try {
        if (!req.session.usuarioId) {
            return res.status(401).json({ mensaje: "Debes iniciar sesión para denunciar contenido" });
        }

        const { id } = req.params;
        const { motivo, descripcion } = req.body;

        if (!motivo) {
            return res.status(400).json({ mensaje: "El motivo de la denuncia es obligatorio" });
        }

        const imagen = await Imagen.findByPk(id);
        if (!imagen) {
            return res.status(404).json({
                mensaje: "La imagen no existe",
            });
        }

        await DenunciaImagen.create({
            motivo,
            descripcion: descripcion || null,
            usuario_id: req.session.usuarioId,
            imagen_id: id,
        });

        const cantidadDenuncias = await DenunciaImagen.count({
            where: {
                imagen_id: id,
            },
        });

        if (cantidadDenuncias > 3) {
            req.session.mensaje =
                "Denuncia registrada. La publicación quedó pendiente de revisión.";

            req.session.tipoMensaje = "warning";

            return res.redirect("/");
        }

        req.session.mensaje = "Denuncia creada correctamente.";
        req.session.tipoMensaje = "success";

        return res.redirect("/");
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            req.session.mensaje = "Ya denunciaste esta imagen anteriormente.";
            req.session.tipoMensaje = "warning";
            return res.redirect("/");
        }
        console.error(error);
        res.status(500).json({ mensaje: "Error al registrar la denuncia" });
    }
};

export const denunciarComentario = async (req, res, next) => {

    try {
        const usuarioId = req.session.usuarioId;
        const { id } = req.params;
        const { motivo, descripcion } = req.body;

        if (!motivo) {
            req.session.mensaje = 'Debes seleccionar un motivo para realizar la denuncia';
            req.session.tipoMensaje = 'warning'; 

            return res.redirect('/');
        }

        const comentario = await Comentario.findByPk(
            id,
            {
                include: [
                    {
                        model: Imagen,
                        include: [
                            {
                                model: Publicacion,
                                as: 'publicacion'
                            }
                        ]
                    }
                ]
            }
        );

        if (!comentario) {
            req.session.mensaje ='El comentario no existe.';
            req.session.tipoMensaje ='warning';
            return res.redirect('/');
        }

        // No puede denunciar su propio comentario
        if (Number(comentario.usuario_id) === Number(usuarioId)) {
            req.session.mensaje ='No podés denunciar tu propio comentario.';
            req.session.tipoMensaje ='warning';
            return res.redirect('/');
        }

        // No se puede denunciar comentarios del autor de la publi
        if (Number(comentario.usuario_id) === Number(comentario.Imagen.publicacion.usuario_id)) {
            req.session.mensaje ='Este comentario no puede denunciarse.';
            req.session.tipoMensaje ='warning';

            return res.redirect('/');
        }

        await DenunciaComentario.create({
            motivo,
            descripcion: descripcion || null,
            usuario_id: req.session.usuarioId,
            comentario_id: comentario.id,
        });

        req.session.mensaje = 'Denuncia de comentario registrada correctamente.';
        req.session.tipoMensaje = 'success';

        return res.redirect('/');

    } catch (error) {

        if (error.name === "SequelizeUniqueConstraintError") {

            req.session.mensaje = "Ya denunciaste este comentario anteriormente.";
            req.session.tipoMensaje = "warning";

            return res.redirect("/");
        }
        next(error);
    }
};

export const listarDenunciasComentarios = async (req, res) => {

    try {
        if (!req.session.usuarioId) {

            return res.redirect('/auth/login');
        }

        const usuarioId = req.session.usuarioId;

        // Denuncias en comentarios hechos en publicaciones del usuario logueado.
        const denunciasRecibidas = await DenunciaComentario.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['id', 'nombre', 'apellido']
                },
                {
                    model: Comentario,
                    include: [
                        {
                            model: Usuario,
                            attributes: ['id', 'nombre', 'apellido']
                        },
                        {
                            model: Imagen,
                            include: [
                                {
                                    model: Publicacion,
                                    as: 'publicacion',
                                    where: {
                                        usuario_id: usuarioId
                                    },
                                    required: true
                                }
                            ],
                            required: true
                        }
                    ],
                    required: true
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        });

        // Denuncias hechas por el usuario logueado.

        const misDenuncias = await DenunciaComentario.findAll({
            where: {
                usuario_id: usuarioId
            },
            include: [
                {
                    model: Comentario,
                    include: [
                        {
                            model: Usuario,
                            attributes: ['id', 'nombre', 'apellido']
                        },
                        {
                            model: Imagen,
                            include: [
                                {
                                    model: Publicacion,
                                    as: 'publicacion'
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

        res.render('denunciasComentarios', {
            denunciasRecibidas,
            misDenuncias
        });

    } catch (error) {
        console.error(
            'Error al cargar denuncias de comentarios:',
            error
        );

        res.status(500).send(
            'Error al cargar denuncias de comentarios'
        );
    }
};
export const eliminarComentarioDenunciado = async (req,res) => {

    try {
        
        const comentario = await Comentario.findByPk( 
            req.params.id, 
            {
                include: [
                    {
                        model: Imagen,
                        include: [
                            {
                                model: Publicacion,
                                as: 'publicacion'
                            }
                        ]
                    }
                ]
            }
        );

        if(!comentario) {

            return res.status(404).send('El comentario no existe');
        }

        if (Number(comentario.Imagen.publicacion.usuario_id) !== Number(req.session.usuarioId)){

            req.session.mensaje = 'No tenés permisos para eliminar este comentario';
            req.session.tipoMensaje = 'danger';

            return res.redirect('/denuncias/comentarios');
        }

        await DenunciaComentario.destroy({
            where: {
                comentario_id: comentario.id
            }
        });

        await comentario.destroy();

        req.session.mensaje = 'Comentario eliminado correctamente.'; 
        req.session.tipoMensaje = 'success';

        return res.redirect('/denuncias/comentarios');

    } catch (error) {
        
        console.error(error);

        res.status(500).send('Error al eliminar el comentario');
    }    
}; 

