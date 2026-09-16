import { DataTypes } from 'sequelize';
import sequelize from './config.js';
import Usuario from './Usuario.js';
import Interes from './Interes.js';

const Mensaje = sequelize.define(
    'Mensaje',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        interes_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'interes',
                key: 'id'
            }
        },
        remitente_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'mensaje',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                fields: ['interes_id']
            }
        ]
    }
);

Interes.hasMany(Mensaje, {foreignKey: 'interes_id',as: 'mensajes'});
Mensaje.belongsTo(Interes, {foreignKey: 'interes_id', as: 'interes'});


Usuario.hasMany(Mensaje, {foreignKey: 'remitente_id', as: 'mensajesEnviados'});
Mensaje.belongsTo(Usuario, {foreignKey: 'remitente_id', as: 'remitente'});


export default Mensaje;