import { DataTypes } from 'sequelize';
import sequelize from './config.js';
import Usuario from './Usuario.js';
import Imagen from './Imagen.js';

const Interes = sequelize.define(
    'Interes',
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
        }
    },
    {
        sequelize,
        tableName: 'interes',
        freezeTableName: true,
        timestamps: true
    }
);

Usuario.hasMany(Interes, {
    foreignKey: 'usuario_id'
});

Interes.belongsTo(Usuario, {
    foreignKey: 'usuario_id'
});

Imagen.hasMany(Interes, {
    foreignKey: 'imagen_id',
    as: 'intereses'
});

Interes.belongsTo(Imagen, {
    foreignKey: 'imagen_id'
});


export default Interes;