import express from 'express';
import { mostrarFormulario, crearPublicacion } from '../controllers/publicacion.js';
import { upload } from '../middlewares/upload.js';
import { esUsuarioAutenticado } from '../middlewares/authMiddle.js';

const router = express.Router();

router.get('/crear', esUsuarioAutenticado, mostrarFormulario);

router.post('/crear', esUsuarioAutenticado, upload.single('imagen'), crearPublicacion);

export default router;