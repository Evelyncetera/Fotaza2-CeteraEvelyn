import express from 'express';

import {
    mostrarPerfil
} from '../controllers/perfil.js';

const router = express.Router();

router.get('/', mostrarPerfil);

export default router;