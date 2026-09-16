import express from 'express';
import { seguirUsuario, dejarDeSeguir, mostrarPublicacionesSeguidos } from '../controllers/follower.js';
import { esUsuarioAutenticado } from "../middlewares/authMiddle.js";

const router = express.Router();

router.get('/seguidos', esUsuarioAutenticado, mostrarPublicacionesSeguidos);
router.post('/seguir', esUsuarioAutenticado, seguirUsuario);
router.post('/dejar-seguir', esUsuarioAutenticado, dejarDeSeguir);

export default router;