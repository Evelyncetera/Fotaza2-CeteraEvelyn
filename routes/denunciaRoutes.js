import { Router } from 'express';
import { denunciarImagen, denunciarComentario } from '../controllers/denunciaController.js';

const router = Router();

router.post('/imagen/:id', denunciarImagen);
router.post('/comentario/:id', denunciarComentario);

export default router;
