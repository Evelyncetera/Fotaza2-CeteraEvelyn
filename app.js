import 'dotenv/config'; //ejecuta los archivos .env
import express from 'express';
import sequelize, { conexionDB } from './models/config.js';
import './models/Usuario.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT; 

//pug
app.set('view engine', 'pug');
app.set('views', './views');


app.use(express.json());
app.use(express.urlencoded( { extended: true} ));

//statics 

//app.use(express.static('public'));


//render

app.get('/', (req, res) => {
    res.render('layoutDePrueba');
});


app.use('/auth', authRoutes);



conexionDB()
    .then(() => {
        app.listen(PORT, (err) =>{
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al iniciar el servidor: ', err);
    });





