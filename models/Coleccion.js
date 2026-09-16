import { DataTypes } from 'sequelize';
import sequelize from './config.js';
import Usuario from './Usuario.js';

const Coleccion = sequelize.define(
    'Coleccion',
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
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'coleccion',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: [
                    'usuario_id',
                    'nombre'
                ]
            }
        ]
    }
);


Usuario.hasMany(Coleccion, {foreignKey: 'usuario_id', as: 'colecciones'});

Coleccion.belongsTo(Usuario, {foreignKey: 'usuario_id', as: 'usuario'});


export default Coleccion;