import { Model, DataTypes } from 'sequelize';
import sequelize from "./config.js";

const Rol = sequelize.define(
    'Rol',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        tableName: 'rol',
        freezeTableName: true,
        timestamps: false
    }
);

export default Rol;