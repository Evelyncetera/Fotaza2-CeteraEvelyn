import { DataTypes } from "sequelize";
import sequelize from "./config.js";
import Publicacion from "./Publicacion.js";
import Tag from "./Tag.js";

const PublicacionTag = sequelize.define(
    'PublicacionTag',
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
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tag',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        tableName: 'publicacion_tag',
        freezeTableName: true,
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['publicacion_id', 'tag_id']
            }
        ]
    }
);

Publicacion.belongsToMany(Tag, {
    through: PublicacionTag,
    as: 'tags',
    foreignKey: 'publicacion_id',
    otherKey: 'tag_id'
});

Tag.belongsToMany(Publicacion, {
    through: PublicacionTag,
    as: 'publicaciones',
    foreignKey: 'tag_id',
    otherKey: 'publicacion_id'
});

export default PublicacionTag;
