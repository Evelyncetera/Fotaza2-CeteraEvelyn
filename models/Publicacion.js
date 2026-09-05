import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Usuario from "./Usuario.js";

const Publicacion = sequelize.define(
    'Publicacion', 
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
        titulo: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        descripcion: {
            type: DataTypes.TEXT
        },
        comentarios_abiertos: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },

        estado: {
            type: DataTypes.ENUM(
                'borrador',
                'publicada',
                'archivada',
                'eliminada', //borrado por el autor
                'bajada'     // bajado por el validador - denuncias > 3 
            ),
            allowNull: false,
            defaultValue: 'publicada'
        }
    },  
    {
        sequelize,
        tableName: 'publicacion',
        freezeTableName: true,
        timestamps:  true,
        createdAt: 'createdAt',
        paranoid: true
}); 

Usuario.hasMany(Publicacion, {foreignKey: 'usuario_id'});
Publicacion.belongsTo(Usuario, {foreignKey: 'usuario_id'});


export default Publicacion;