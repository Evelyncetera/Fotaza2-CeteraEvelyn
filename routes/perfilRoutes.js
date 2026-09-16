import express from 'express';
import { mostrarPerfil, mostrarPerfilPublico } from '../controllers/perfil.js';
import { esUsuarioAutenticado } from '../middlewares/authMiddle.js';

const router = express.Router();

router.get('/', esUsuarioAutenticado, mostrarPerfil);
router.get('/:id', esUsuarioAutenticado, mostrarPerfilPublico);

export default router;