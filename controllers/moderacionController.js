import DenunciaImagen from '../models/DenunciaImagen.js';
import Imagen from '../models/Imagen.js';
import Publicacion from '../models/Publicacion.js';
import Usuario from '../models/Usuario.js';

export const mostrarModeracion = async (req, res) => {
    try {
        const denuncias = await DenunciaImagen.findAll({
            attributes: ['imagen_id']
        });

        const conteoPorImagen = new Map();

        for (const aux of denuncias) {
            const imagenId = aux.imagen_id;

            conteoPorImagen.set(imagenId, (conteoPorImagen.get(imagenId) || 0) + 1);
        }

        const imagenesParaRevision = [];

        for( const [imagenId, cant] of conteoPorImagen.entries()){
            if(cant > 3) {
                imagenesParaRevision.push(imagenId);
            }
        }

        if(imagenesParaRevision.length === 0) {
            return res.render('moderacion', {
                casos: []
            });
        }
        const imagenes = await Imagen.findAll({
            where: {
                id: imagenesParaRevision
            },
            include: [
                {
                    model: Publicacion,
                    as: 'publicacion',
                    where: {
                        estado: 'publicada'
                    }
                }
            ]
        });

        const casos = imagenes.map(imagen => ({
            imagen,
            publicacion: imagen.publicacion,
            cantidadDenuncias:
                conteoPorImagen.get(imagen.id)
        }));

        res.render('moderacion', {
            casos
        });

    } catch (error) {
        console.error('Error al cargar moderación', error);

        req.session.mensaje = 'Error al cargar la sección de moderación.';
        req.session.tipoMensaje = 'danger';
        res.redirect('/');
    }
};

export const darDeBajaPublicacion = async (req, res) => {
    try {
        const { id } = req.params;

        const publicacion = await Publicacion.findByPk(id);

        if (!publicacion) {
            req.session.mensaje = 'La publicación no existe.';
            req.session.tipoMensaje = 'warning';
            return res.redirect('/moderacion');
        }

        await publicacion.update({
            estado: 'bajada'
        });

        await publicacion.destroy();

        const imagenesPublicacion = await Imagen.findAll({
            where: {
                publicacion_id: id
            },
            attributes: ['id']
        });

        const imagenIds = imagenesPublicacion.map(img => img.id);

        if (imagenIds.length > 0) {
            await DenunciaImagen.destroy({
                where: {
                    imagen_id: imagenIds
                }
            });
        }

        const cantidadBajadas = await Publicacion.count({
            where: {
                usuario_id: publicacion.usuario_id,
                estado: 'bajada'
            },
            paranoid: false
        });

        if (cantidadBajadas >= 3) {
            await Usuario.update(
                {
                    activo: false
                },
                {
                    where: {
                        id: publicacion.usuario_id
                    }
                }
            );
        }

        req.session.mensaje = 'La publicación fue dada de baja correctamente.';
        req.session.tipoMensaje = 'success';

        return res.redirect('/moderacion');

    } catch (error) {
        console.error(
            'Error al dar de baja la publicación:',
            error
        );

        req.session.mensaje = 'Error al dar de baja la publicación.';
        req.session.tipoMensaje = 'danger';
        res.redirect('/moderacion');
    }
};

export const  desestimarDenuncias = async (req, res) => {
    try {
        const {imagenId } = req.params; 

        await DenunciaImagen.destroy({ 
            where : { imagen_id: imagenId}
        });

        req.session.mensaje = 'Las denuncias fueron desestimadas correctamente.';
        req.session.tipoMensaje = 'success';

        return res.redirect('/moderacion');

    } catch (error) {
        console.error('Error al desestimar las denuncias', error);

        req.session.mensaje = 'Error al desestimar las denuncias.';
        req.session.tipoMensaje = 'danger';
        res.redirect('/moderacion');
    }
};