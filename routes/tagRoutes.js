import express from 'express';
import { listarTags, buscarTagPorId, crearTag } from '../controllers/TagController.js';

const router = express.Router();

router.get('/', listarTags);
router.get('/:id', buscarTagPorId);
router.post('/crear', crearTag);

export default router;
