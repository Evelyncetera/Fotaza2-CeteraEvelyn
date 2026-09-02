import { Model, DataTypes } from 'sequelize';
import sequelize from "./config.js";
import Rol from './Rol.js';

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
        rol_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rol',
                key: 'id'
            }
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

Rol.hasMany(User, {
    foreignKey: 'rol_id',
    as: 'usuarios'
});

User.belongsTo(Rol, {
    foreignKey: 'rol_id',
    as: 'rol'
});

export default User;
