import { Router } from 'express';
import { denunciarImagen, denunciarComentario, listarDenunciasComentarios, eliminarComentarioDenunciado } from '../controllers/denunciaController.js';
import { esUsuarioAutenticado } from "../middlewares/authMiddle.js";

const router = Router();

router.get('/comentarios', esUsuarioAutenticado, listarDenunciasComentarios);


router.post('/imagen/:id', esUsuarioAutenticado, denunciarImagen);
router.post('/comentario/:id', esUsuarioAutenticado, denunciarComentario);
router.post('/comentarios/eliminar/:id', esUsuarioAutenticado, eliminarComentarioDenunciado);

export default router;
