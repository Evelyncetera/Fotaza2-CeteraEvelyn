import express from 'express';
import { seguirUsuario, dejarDeSeguir } from '../controllers/follower.js';

const router = express.Router();

router.post('/seguir', seguirUsuario);
router.post('/dejar-seguir', dejarDeSeguir);

export default router;