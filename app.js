import 'dotenv/config'; //ejecuta los archivos .env
import express from 'express';

const app = express();
const PORT = process.env.PORT; 

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded( { extended: true} ));


app.get('/', (req,res) => {
    res.send('¡HOLA, ESTO ES FOTAZA 2 :) !');
}); 








app.listen(PORT, (err) =>{
    if(err){
        console.error('Error al iniciar el servidor: ', err);
        return;
    }
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});