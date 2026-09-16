import express from 'express';
import {listarConversaciones, mostrarConversacion, enviarMensaje} from '../controllers/mensajeController.js';
import {esUsuarioAutenticado} from '../middlewares/authMiddle.js';


const router = express.Router();

router.get('/', esUsuarioAutenticado, listarConversaciones);
router.get('/:interesId', esUsuarioAutenticado, mostrarConversacion);
router.post('/:interesId', esUsuarioAutenticado, enviarMensaje);


export default router;