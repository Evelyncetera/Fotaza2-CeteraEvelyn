import { DataTypes } from 'sequelize';
import sequelize from './config.js';
import Usuario from './Usuario.js';
import Publicacion from './Publicacion.js';
import Imagen from './Imagen.js';


const Notificacion = sequelize.define(
    'Notificacion',
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

        actor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario',
                key: 'id'
            }
        },

        tipo: {
            type: DataTypes.ENUM(
                'comentario',
                'valoracion',
                'interes',
                'seguimiento'
            ),
            allowNull: false
        },

        publicacion_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'publicacion',
                key: 'id'
            }
        },

        imagen_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'imagen',
                key: 'id'
            }
        },

        leida: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: 'notificacion',
        freezeTableName: true,
        timestamps: true
    }
);


Usuario.hasMany(Notificacion, {
    foreignKey: 'usuario_id',
    as: 'notificaciones'
});

Notificacion.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'destinatario'
});


Usuario.hasMany(Notificacion, {
    foreignKey: 'actor_id',
    as: 'notificacionesGeneradas'
});

Notificacion.belongsTo(Usuario, {
    foreignKey: 'actor_id',
    as: 'actor'
});


Publicacion.hasMany(Notificacion, {
    foreignKey: 'publicacion_id',
    as: 'notificaciones'
});

Notificacion.belongsTo(Publicacion, {
    foreignKey: 'publicacion_id',
    as: 'publicacion'
});


Imagen.hasMany(Notificacion, {
    foreignKey: 'imagen_id',
    as: 'notificaciones'
});

Notificacion.belongsTo(Imagen, {
    foreignKey: 'imagen_id',
    as: 'imagen'
});


export default Notificacion;