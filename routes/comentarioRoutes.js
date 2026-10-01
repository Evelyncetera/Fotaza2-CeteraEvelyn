import express from 'express';
import { crearComentario } from '../controllers/comentario.js';
import { esUsuarioAutenticado } from '../middlewares/authMiddle.js';

const router = express.Router();

router.post('/crear', esUsuarioAutenticado, crearComentario);

export default router;