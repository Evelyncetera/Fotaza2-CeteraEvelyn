import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Publicacion from "./Publicacion.js";

const Imagen = sequelize.define(
    'Imagen',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        publicacion_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'publicacion',
                key: 'id'
            }
        },

        archivo: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'imagen',
        freezeTableName: true,
        timestamps: true
    }
);

Publicacion.hasMany(Imagen, {
    foreignKey: 'publicacion_id',
    as: 'imagenes'
});

Imagen.belongsTo(Publicacion, {
    foreignKey: 'publicacion_id'
});

export default Imagen;