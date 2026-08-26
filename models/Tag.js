import { DataTypes } from "sequelize";
import sequelize from "./config.js";

const Tag = sequelize.define(
    'Tag',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    },
    {
        sequelize,
        tableName: 'tag',
        freezeTableName: true,
        timestamps: true
    }
);

export default Tag;
