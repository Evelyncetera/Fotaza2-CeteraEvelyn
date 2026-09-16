import { DataTypes } from 'sequelize';
import sequelize from './config.js';
import Coleccion from './Coleccion.js';
import Publicacion from './Publicacion.js';


const ColeccionPublicacion = sequelize.define(
    'ColeccionPublicacion',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        coleccion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'coleccion',
                key: 'id'
            }
        },
        publicacion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'publicacion',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'coleccion_publicacion',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: [
                    'coleccion_id',
                    'publicacion_id'
                ]
            }
        ]
    }
);


Coleccion.belongsToMany(
    Publicacion,
    {
        through: ColeccionPublicacion,
        as: 'publicaciones',
        foreignKey: 'coleccion_id',
        otherKey: 'publicacion_id'
    }
);


Publicacion.belongsToMany(
    Coleccion,
    {
        through: ColeccionPublicacion,
        as: 'colecciones',
        foreignKey: 'publicacion_id',
        otherKey: 'coleccion_id'
    }
);


export default ColeccionPublicacion;