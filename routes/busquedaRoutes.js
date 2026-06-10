import express from 'express';
import { buscarPublicaciones } from '../controllers/busqueda.js';

const router = express.Router();

router.get('/', buscarPublicaciones);

export default router;