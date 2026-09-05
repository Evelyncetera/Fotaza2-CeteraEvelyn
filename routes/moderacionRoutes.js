import { Router } from 'express';
import { mostrarModeracion, darDeBajaPublicacion, desestimarDenuncias } from '../controllers/moderacionController.js';
import { esValidador } from '../middlewares/authMiddle.js';

const router = Router();

router.get('/', esValidador, mostrarModeracion);

router.post('/baja/:id', esValidador, darDeBajaPublicacion); 
router.post('/desestimar/:imagenId', esValidador, desestimarDenuncias);

export default router;