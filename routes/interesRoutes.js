import express from 'express';
import { marcarInteres, mostrarInteresados } from '../controllers/interes.js';
import { esUsuarioAutenticado } from "../middlewares/authMiddle.js";

const router = express.Router();

router.post('/toggle', esUsuarioAutenticado, marcarInteres);
router.get('/recibidos', esUsuarioAutenticado, mostrarInteresados);


export default router;