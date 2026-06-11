import { DataTypes } from 'sequelize';
import sequelize from './config.js';
import Usuario from './Usuario.js';

const Follower = sequelize.define(
    'Follower',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        seguidor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },

        seguido_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'follower',
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,

        indexes: [
            {
                unique: true,
                fields: ['seguidor_id', 'seguido_id']
            }
        ]
    }
);

Usuario.belongsToMany(Usuario, {
    through: Follower,
    as: 'seguidos',
    foreignKey: 'seguidor_id',
    otherKey: 'seguido_id',
});

Usuario.belongsToMany(Usuario, {
    through: Follower,
    as: 'seguidores',
    foreignKey: 'seguido_id',
    otherKey: 'seguidor_id',
});

export default Follower;