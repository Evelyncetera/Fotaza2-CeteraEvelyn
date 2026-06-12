import 'dotenv/config';
import './models/Usuario.js';
import './models/Publicacion.js';
import './models/Imagen.js';
import './models/Comentario.js';
import './models/Valoracion.js';
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
import followerRoutes from './routes/followerRoutes.js';
import perfilRoutes from './routes/perfilRoutes.js';
import { upload } from './middlewares/multerCloudinary.js';
import './middlewares/cloudinary.js';


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

//rutas
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/publicaciones', publicacionRoutes);
app.use('/buscar', busquedaRoutes);
app.use('/comentarios', comentarioRoutes);
app.use('/valoraciones', valoracionRoutes);
app.use('/interes', interesRoutes);
app.use('/follower', followerRoutes);
app.use('/perfil', perfilRoutes);

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





