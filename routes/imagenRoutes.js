import express from 'express';
import {alternarComentarios} from '../controllers/imagenController.js';
import {esUsuarioAutenticado} from '../middlewares/authMiddle.js';

const router = express.Router();

router.post('/:id/comentarios/toggle', esUsuarioAutenticado, alternarComentarios);


export default router;