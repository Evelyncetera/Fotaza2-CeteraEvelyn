import express from 'express';
import { mostrarHome, probarCreacion } from '../controllers/home.js';

const router = express.Router();

router.get('/', mostrarHome);
router.post('/probar-creacion', probarCreacion);

export default router;