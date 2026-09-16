import express from 'express';
import {listarNotificaciones, abrirNotificacion, marcarTodasLeidas} from '../controllers/notificacion.js';

import {esUsuarioAutenticado} from '../middlewares/authMiddle.js';


const router = express.Router();

router.get('/', esUsuarioAutenticado, listarNotificaciones);
router.get('/:id/abrir', esUsuarioAutenticado, abrirNotificacion);
router.post('/leer-todas', esUsuarioAutenticado, marcarTodasLeidas);

export default router;