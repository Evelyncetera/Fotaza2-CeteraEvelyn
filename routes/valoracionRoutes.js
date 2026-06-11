import express from 'express';
import { crearValoracion } from '../controllers/valoracion.js';

const router = express.Router();

router.post('/crear', crearValoracion);

export default router;