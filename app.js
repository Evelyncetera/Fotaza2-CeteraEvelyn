import 'dotenv/config'; //ejecuta los archivos .env
import './models/Usuario.js';
import './models/Publicacion.js';
import './models/Imagen.js';
import express from 'express';
import session from 'express-session';
import sequelize, { conexionDB } from './models/config.js';
import authRoutes from './routes/authRoutes.js';
import homeRoutes from './routes/home.js';
import publicacionRoutes from './routes/publicacionRoutes.js';


const app = express();
const PORT = process.env.PORT; 


//pug
app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', homeRoutes);
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true} ));

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24h
    }
}));

app.use('/auth', authRoutes);
app.use('/publicaciones', publicacionRoutes);


conexionDB()
    .then(() => {
        app.listen(PORT, (err) =>{
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al iniciar el servidor: ', err);
    });





