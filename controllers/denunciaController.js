import DenunciaImagen from '../models/DenunciaImagen.js';
import DenunciaComentario from '../models/DenunciaComentarios.js';
import Imagen from "../models/Imagen.js";

export const denunciarImagen = async (req, res) => {
    try {
        if (!req.session.usuarioId) {
            return res.status(401).json({ mensaje: 'Debes iniciar sesión para denunciar contenido' });
        }

        const { id } = req.params;
        const { motivo, descripcion } = req.body;

        if (!motivo) {
            return res.status(400).json({ mensaje: 'El motivo de la denuncia es obligatorio' });
        }

        const imagen = await Imagen.findByPk(id);
        if (!imagen) {
            return res.status(404).json({
                mensaje: 'La imagen no existe'
            });
        }

        await DenunciaImagen.create({
            motivo,
            descripcion: descripcion || null,
            usuario_id: req.session.usuarioId,
            imagen_id: id
        });

        const cantidadDenuncias = await DenunciaImagen.count({
            where: {
                imagen_id: id
            }
        });

        if (cantidadDenuncias > 3) {
            req.session.mensaje = 'Denuncia registrada. La publicación quedó pendiente de revisión.';

            req.session.tipoMensaje = 'warning';

            return res.redirect('/');
        }

        req.session.mensaje = 'Denuncia creada correctamente.';
        req.session.tipoMensaje = 'success';

        return res.redirect('/');

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            
            req.session.mensaje = "Ya denunciaste esta imagen anteriormente.";
            req.session.tipoMensaje = "warning";
            return res.redirect("/");
        }
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar la denuncia' });
    }
};

export const denunciarComentario = async (req, res) => {
    try {
        if (!req.session.usuarioId) {
            return res.status(401).json({ mensaje: 'Debes iniciar sesión para denunciar contenido' });
        }

        const { id } = req.params;
        const { motivo, descripcion } = req.body;

        if (!motivo) {
            return res.status(400).json({ mensaje: 'El motivo de la denuncia es obligatorio' });
        }

        await DenunciaComentario.create({
            motivo,
            descripcion: descripcion || null,
            usuario_id: req.session.usuarioId,
            comentario_id: id
        });

        res.status(201).json({ mensaje: 'Denuncia de comentario registrada correctamente' });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ mensaje: 'Ya has denunciado este contenido anteriormente' });
        }
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar la denuncia' });
    }
};
