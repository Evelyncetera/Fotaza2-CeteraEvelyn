import express from 'express';
import { crearComentario } from '../controllers/comentario.js';

const router = express.Router();

router.post('/crear', crearComentario);

export default router;