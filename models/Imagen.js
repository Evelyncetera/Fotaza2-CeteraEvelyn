import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Publicacion from "./Publicacion.js";

const Imagen = sequelize.define(
    'Imagen',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        publicacion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'publicacion',
                key: 'id'
            }
        },

        archivo: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        licencia: {
            type: DataTypes.ENUM(
                'sin_copyright',
                'copyright',
            ),
            allowNull: false,
            defaultValue: 'sin_copyright'
        },
        marca_de_agua :{
            type: DataTypes.STRING,
            allowNull: true
        }, 
        comentarios_abiertos: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        sequelize,
        tableName: 'imagen',
        freezeTableName: true,
        timestamps: true
    }
);

Publicacion.hasMany(Imagen, {
    foreignKey: 'publicacion_id',
    as: 'imagenes'
});

Imagen.belongsTo(Publicacion, {
    foreignKey: 'publicacion_id',
    as: 'publicacion'
});

export default Imagen;