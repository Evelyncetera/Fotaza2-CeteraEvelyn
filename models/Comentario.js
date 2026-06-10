import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";

const Comentario = sequelize.define(
    'Comentario', 
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
        publicacion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'publicacion',
                key: 'id'
            }
        },
        texto: {
            type: DataTypes.TEXT
        },
    },  
    {
        sequelize,
        tableName: 'comentario',
        freezeTableName: true,
        timestamps:  true,
        createdAt: 'createdAt',
        paranoid: true
}); 

Usuario.hasMany(Comentario, { 
    foreignKey: 'usuario_id'
});

Comentario.belongsTo(Usuario, {
    foreignKey: 'usuario_id'
});

Publicacion.hasMany(Comentario, {
    foreignKey: 'publicacion_id',
    as: 'comentarios'
});

Comentario.belongsTo(Publicacion, {
    foreignKey: 'publicacion_id'
});


export default Comentario;