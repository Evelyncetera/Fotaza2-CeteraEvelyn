import express from 'express';

import { marcarInteres } from '../controllers/interes.js';

const router = express.Router();

router.post('/toggle', marcarInteres);

export default router;