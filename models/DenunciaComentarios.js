import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Usuario from "./Usuario.js";
import Comentario from "./Comentario.js";


const DenunciaComentario = sequelize.define(
    'DenunciaComentario',
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
        comentario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: {
                model: 'comentario',
                key: 'id'
            }
        }
    },
    {
        sequelize, 
        tableName: 'denuncia_comentario',
        freezeTableName: true,
        timestamps: true, 
        createdAt: 'createdAt',
        indexes: [
            {
                unique: true,
                fields: ['usuario_id', 'comentario_id'],
                name: 'unique_denuncia_usuario_comentario' //Para que el usuario no haga múltiples denuncias a una misma imagen
            }
        ]
    }
);

Usuario.hasMany(DenunciaComentario, { foreingKey: 'usuario_id'});
DenunciaComentario.belongsTo(Usuario, { foreingKey: 'usuario_id'});

Comentario.hasMany(DenunciaComentario, {foreingKey: 'comentario_id'});
DenunciaComentario.belongsTo(Comentario, {foreingKey: 'comentario_id'});

export default DenunciaComentario;