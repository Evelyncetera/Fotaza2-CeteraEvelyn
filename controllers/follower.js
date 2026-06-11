import Follower from '../models/Follower.js';

export const seguirUsuario = async (req, res) => {

    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }

        const seguidor_id = req.session.usuarioId;
        const { seguido_id } = req.body;

        if (seguidor_id == seguido_id) {
            return res.send(
                'No podés seguirte a vos mismo'
            );
        }

        const seguimientoExistente = await Follower.findOne({
            where: {
                seguidor_id,
                seguido_id
            }
        });

        if (seguimientoExistente) {
            return res.send(
                'Ya seguís a este usuario'
            );
        }

        await Follower.create({
            seguidor_id,
            seguido_id
        });

        res.redirect('/');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            'Error al seguir usuario'
        );
    }
};


export const dejarDeSeguir = async (req, res) => {

    try {

        const seguidor_id = req.session.usuarioId;
        const { seguido_id } = req.body;

        await Follower.destroy({
            where: {
                seguidor_id,
                seguido_id
            }
        });

        res.redirect('/');

    } catch (error) {

        console.error(error);

        res.status(500).send(
            'Error al dejar de seguir'
        );
    }
};