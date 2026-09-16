import 'dotenv/config';
import './models/Rol.js';
import './models/Usuario.js';
import './models/Publicacion.js';
import './models/Imagen.js';
import './models/Comentario.js';
import './models/Valoracion.js';
import './models/Tag.js';
import './models/PublicacionTag.js';
import "./models/DenunciaImagen.js";
import "./models/DenunciaComentarios.js";
import express from 'express';
import session from 'express-session';
import sequelize, { conexionDB } from './models/config.js';
import authRoutes from './routes/authRoutes.js';
import homeRoutes from './routes/home.js';
import publicacionRoutes from './routes/publicacionRoutes.js';
import busquedaRoutes from './routes/busquedaRoutes.js';
import comentarioRoutes from './routes/comentarioRoutes.js';
import valoracionRoutes from './routes/valoracionRoutes.js';
import interesRoutes from './routes/interesRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import followerRoutes from './routes/followerRoutes.js';
import perfilRoutes from './routes/perfilRoutes.js';
import denunciaRoutes from './routes/denunciaRoutes.js';
import moderacionRoutes from './routes/moderacionRoutes.js';
import imagenRoutes from './routes/imagenRoutes.js';

import { upload } from './middlewares/multerCloudinary.js';
import './middlewares/cloudinary.js';
import { usuarioMiddleware } from './middlewares/authMiddle.js';


const app = express();
const PORT = process.env.PORT; 

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true} ));


//SESSION
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24h
    }
}));

app.use(usuarioMiddleware);

//rutas
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/publicaciones', publicacionRoutes);
app.use('/buscar', busquedaRoutes);
app.use('/comentarios', comentarioRoutes);
app.use('/valoraciones', valoracionRoutes);
app.use('/tags', tagRoutes);
app.use('/interes', interesRoutes);
app.use('/follower', followerRoutes);
app.use('/perfil', perfilRoutes);
app.use('/denuncias', denunciaRoutes);
app.use('/moderacion', moderacionRoutes);
app.use('/imagenes',imagenRoutes);

//404
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

//global error
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).send('Ocurrió un error interno en el servidor');
});

// Conexion a BD
conexionDB()
    .then(() => {
        app.listen(PORT, (err) =>{
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al iniciar el servidor: ', err);
    });





