import express from 'express';
import { mostrarFormulario, crearPublicacion } from '../controllers/publicacion.js';

const router = express.Router();

router.get('/', mostrarFormulario);

router.post('/', crearPublicacion);

export default router;