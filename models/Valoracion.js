import { DataTypes } from "sequelize";
import sequelize from "./config.js";

const Valoracion = sequelize.define(
    'Valoracion',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        imagen_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        valor: {
            type: DataTypes.INTEGER,
            allowNull: false,

            validate: {
                min: 1,
                max: 5
            }
        }
    },
    {
        sequelize,
        tableName: 'valoracion',
        freezeTableName: true,
        timestamps: true
    }
);

import Usuario from './Usuario.js';
import Imagen from './Imagen.js';

Usuario.hasMany(Valoracion, {
    foreignKey: 'usuario_id'
});

Valoracion.belongsTo(Usuario, {
    foreignKey: 'usuario_id'
});

Imagen.hasMany(Valoracion, {
    foreignKey: 'imagen_id',
    as: 'valoraciones'
});

Valoracion.belongsTo(Imagen, {
    foreignKey: 'imagen_id'
});



export default Valoracion;