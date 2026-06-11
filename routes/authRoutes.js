import express from 'express';
import { mostrarUsuario, registroUsuario } from '../controllers/authController.js';
import { mostrarLogin, validarUsuario, cerrarSesion } from '../controllers/authController.js';

const router = express.Router();

router.get('/registro', mostrarUsuario);
router.post('/registro', registroUsuario);

router.get('/login', mostrarLogin);
router.post('/login', validarUsuario);

router.get('/logout', cerrarSesion);
export default router;