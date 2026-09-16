import express from 'express';
import { crearValoracion } from '../controllers/valoracion.js';
import { esUsuarioAutenticado } from "../middlewares/authMiddle.js";

const router = express.Router();

router.post('/crear', esUsuarioAutenticado, crearValoracion);

export default router;