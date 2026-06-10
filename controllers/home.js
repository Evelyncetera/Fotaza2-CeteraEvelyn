import Publicacion from "../models/Publicacion.js";
import Usuario from "../models/Usuario.js";
import Imagen from "../models/Imagen.js";
import Comentario from "../models/Comentario.js";

export const mostrarHome = async (req, res) => {
    try {
        const publicaciones = await Publicacion.findAll({
            
            include: [
                Usuario, 
                { 
                model: Imagen,
                as: 'imagenes'
                },
                {
                    model: Comentario,
                    as: 'comentarios',
                    include: [Usuario]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        console.log(JSON.stringify(publicaciones, null, 2));
        const usuarioId = req.session ? req.session.usuarioId : null;

        console.log("Cantidad de publicaciones encontradas:", publicaciones.length);
        res.render('home', {
            publicaciones,
            usuarioLogueado: usuarioId,
            fotosmostradas: []
        });
    } catch (error){
        console.error(error);
        res.status(500).send("Error al cargar el home");
    }
};
