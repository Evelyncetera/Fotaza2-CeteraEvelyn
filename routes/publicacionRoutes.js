import express from 'express';
import { mostrarFormulario, crearPublicacion, eliminarPublicacion } from '../controllers/publicacion.js';
import { upload } from '../middlewares/multerCloudinary.js';
import { esUsuarioAutenticado } from '../middlewares/authMiddle.js';

const router = express.Router();

router.get('/crear', esUsuarioAutenticado, mostrarFormulario);
router.post('/crear', esUsuarioAutenticado, upload.array('imagenes'), crearPublicacion);
router.post('/eliminar/:id', esUsuarioAutenticado, eliminarPublicacion);

export default router;