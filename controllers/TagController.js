import Tag from '../models/Tag.js';

export const listarTags = async (req, res) => {
    try {
        const tags = await Tag.findAll({
            order: [['nombre', 'ASC']]
        });
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener tags');
    }
};

export const buscarTagPorId = async (req, res) => {
    try {
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).send('Tag no encontrado');
        }
        res.json(tag);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener tag');
    }
};

export const crearTag = async (req, res) => {
    try {
        if (!req.session.usuarioId) {
            return res.redirect('/auth/login');
        }
        const { nombre } = req.body;

        const existente = await Tag.findOne({ where: { nombre } });
        if (existente) {
            return res.status(409).send('El tag ya existe');
        }

        const tag = await Tag.create({ nombre });
        res.status(201).json(tag);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear tag');
    }
};
