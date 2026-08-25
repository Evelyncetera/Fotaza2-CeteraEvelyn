import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Usuario from "./Usuario.js";
import Imagen from "./Imagen.js";


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
        imagen_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'imagen',
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

Imagen.hasMany(Comentario, {
    foreignKey: 'imagen_id',
    as: 'comentarios'
});

Comentario.belongsTo(Imagen, {
    foreignKey: 'imagen_id'
});


export default Comentario;