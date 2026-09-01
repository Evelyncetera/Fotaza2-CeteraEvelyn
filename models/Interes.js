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
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },

        imagen_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'imagen',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'interes',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                unique: true, 
                fields: ['usuario_id', 'imagen_id']
            }
        ]
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