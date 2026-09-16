import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Usuario from './Usuario.js';
import Imagen from './Imagen.js';

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
        },

        valor: {
            type: DataTypes.INTEGER,
            allowNull: false,

            validate: {
                min: 1,
                max: 5,
                isInt: true
            }
        }
    },
    {
        sequelize,
        tableName: 'valoracion',
        freezeTableName: true,
        timestamps: true,

        indexes: [
            {
                unique: true,
                fields: [
                    'usuario_id',
                    'imagen_id'
                ],
                name: 'unique_valoracion_usuario_imagen'
            }
        ]
    }
);


Usuario.hasMany(Valoracion, {foreignKey: 'usuario_id'});

Valoracion.belongsTo(Usuario, {foreignKey: 'usuario_id'});

Imagen.hasMany(Valoracion, {foreignKey: 'imagen_id', as: 'valoraciones'});

Valoracion.belongsTo(Imagen, {foreignKey: 'imagen_id'});



export default Valoracion;