import express from 'express';
import { mostrarUsuario, registroUsuario } from '../controllers/authController.js';

const router = express.Router();

router.get('/registro', mostrarUsuario);

router.post('/registro', registroUsuario);

export default router;