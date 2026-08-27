import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Usuario from "./Usuario.js";
import Imagen from "./Imagen.js";


const DenunciaImagen = sequelize.define(
    'DenunciaImagen',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        motivo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: {
                model: 'usuario',
                key: 'id'
            }
        },
        imagen_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: {
                model: 'imagen',
                key: 'id'
            }
        }
    },
    {
        sequelize, 
        tableName: 'denuncia_imagen',
        freezeTableName: true,
        timestamps: true, 
        createdAt: 'createdAt',
        indexes: [
            {
                unique: true,
                fields: ['usuario_id', 'imagen_id'],
                name: 'unique_denuncia_usuario_imagen' //Para que el usuario no haga múltiples denuncias a una misma imagen
            }
        ]
    }
);

Usuario.hasMany(DenunciaImagen, { foreingKey: 'usuario_id'});
DenunciaImagen.belongsTo(Usuario, { foreingKey: 'usuario_id'});

Imagen.hasMany(DenunciaImagen, {foreingKey: 'imagen_id'});
DenunciaImagen.belongsTo(Imagen, {foreingKey: 'imagen_id'});

export default DenunciaImagen;