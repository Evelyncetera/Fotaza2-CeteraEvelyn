import { Model, DataTypes } from 'sequelize';
import sequelize from "./config.js";

class User extends Model {}

User.init (
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING, 
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rol: {
            type: DataTypes.STRING,
            defaultValue: 'usuario'
        },
        activo: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        avatar: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        tableName: 'usuario',
        modelName: 'User',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: false,
        paranoid: true, //borrado logico
    }
);

export default User;
