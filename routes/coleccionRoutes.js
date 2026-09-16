import express from 'express';
import {
    listarColecciones,
    mostrarColeccion,
    crearColeccion,
    agregarPublicacion,
    quitarPublicacion,
    toggleFavorito 
} from '../controllers/coleccion.js';
import {esUsuarioAutenticado} from '../middlewares/authMiddle.js';


const router = express.Router();

router.get('/', esUsuarioAutenticado, listarColecciones);
router.get('/:id', esUsuarioAutenticado, mostrarColeccion);
router.post('/crear', esUsuarioAutenticado, crearColeccion);
router.post('/agregar-publicacion', esUsuarioAutenticado, agregarPublicacion);
router.post('/quitar-publicacion', esUsuarioAutenticado, quitarPublicacion);
router.post('/favoritos/toggle', esUsuarioAutenticado, toggleFavorito);


export default router;