import 'dotenv/config';
import { Sequelize } from 'sequelize';


export const sequelize =  process.env.DATABASE_URL

    ? new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',    
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})

    : new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        logging: false
    });


export const conexionDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a PostgreSQL realizada con éxito.');

        /* await sequelize.sync();
        //await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados correctamente con las tablas de la Base de Datos'); */
    } catch(error) {
        console.log('Error al conectar Base de Datos: ', error);
        throw error;
    }
};


export default sequelize;