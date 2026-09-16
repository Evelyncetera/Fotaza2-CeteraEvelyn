'use strict';
import bcrypt from 'bcrypt';
import User from '../models/Usuario.js';
import Publicacion from '../models/Publicacion.js';
import Imagen from '../models/Imagen.js';
import Rol from '../models/Rol.js';
import Follower from '../models/Follower.js';
import cloudinary from '../middlewares/cloudinary.js';
import Tag from '../models/Tag.js';
import '../models/PublicacionTag.js';

export const ejecutarSeed = async (queryInterface = null) => {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash('123456', salt);

    const [rolComun] = await Rol.findOrCreate({
        where: {
            nombre: 'comun'
        }
    });

    const [rolValidador] = await Rol.findOrCreate({
        where: {
            nombre: 'validador'
        }
    });

    const usuarios = await User.bulkCreate([
        //usuarios comunes
        { nombre: 'UsuarioA', apellido: 'Demo', email: 'usuarioA@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar1.jpg'},
        { nombre: 'UsuarioB', apellido: 'Demo', email: 'usuarioB@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar2.jpg'},
        { nombre: 'UsuarioC', apellido: 'Demo', email: 'usuarioC@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar1.jpg'},
        { nombre: 'UsuarioD', apellido: 'Demo', email: 'usuarioD@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar2.jpg'},
        
        
        //usuario validador
        {nombre: 'Validador', apellido: 'Demo', email: 'validador@fotaza.com', password_hash: pass, rol_id: rolValidador.id, activo: true}
    ]);

    const imagenUsuarioC = cloudinary.url(
        'fotaza2/zjis53wkbwptclfekjbm',
        {
            secure: true
        }
    );

    const imagenUsuarioD = cloudinary.url(
        'fotaza2/kk7hd7lnzdsggyrvzfdy',
        {
            secure: true
        }
    );


    const publicaciones = await Publicacion.bulkCreate([
        { 
            titulo: "Mi primer post", 
            descripcion: "Foto increíble", 
            usuario_id: usuarios[0].id, 
            createdAt: new Date('2026-09-10T12:00:00-03:00'), 
            updatedAt: new Date('2026-09-10T12:00:00-03:00')
        },
        { titulo: "Atardecer en San Luis", 
            descripcion: "Disfrutando el paisaje", 
            usuario_id: usuarios[1].id,
            createdAt: new Date('2026-09-12T18:30:00-03:00'), 
            updatedAt: new Date('2026-09-12T18:30:00-03:00')
        },
        {
            titulo: "Salida en bicicleta",
            descripcion: "Una tarde recorriendo la ciudad",
            usuario_id: usuarios[2].id,
            createdAt: new Date('2026-09-13T16:00:00-03:00'),
            updatedAt: new Date('2026-09-13T16:00:00-03:00')
        },

        {
            titulo: "Explorando nuevos lugares",
            descripcion: "Una nueva fotografía para compartir",
            usuario_id: usuarios[3].id,
            createdAt: new Date('2026-09-14T11:30:00-03:00'),
            updatedAt: new Date('2026-09-14T11:30:00-03:00')
        }
    ]);
    console.log("Publicaciones creadas correctamente.");

    const nombresTags = [
        'paisaje',
        'naturaleza',
        'atardecer',
        'san luis',
        'bicicleta',
        'ciudad',
        'aventura'
    ];
    const tags = {};

    for (const nombre of nombresTags) {
        const [tag] = await Tag.findOrCreate({
            where: { nombre },
            defaults: { nombre }
        });
        tags[nombre] = tag;
    }

    await publicaciones[0].setTags([
        tags['paisaje'],
        tags['naturaleza']
    ]);

    await publicaciones[1].setTags([
        tags['atardecer'],
        tags['san luis']
    ]);

    await publicaciones[2].setTags([
        tags['bicicleta'],
        tags['ciudad']
    ]);

    await publicaciones[3].setTags([
        tags['aventura'],
        tags['naturaleza']
    ]);


    const generarMarcaAgua = (usuario) => {
        return `© ${usuario.nombre} ${usuario.apellido}`;
    };

    const marcaAguaSeeder = generarMarcaAgua(usuarios[1]);

    const imagenCopyright = cloudinary.url(
        'fotaza2/h5fogrnyvx3ua3y4xc3h',
        {
            secure: true,
            transformation: [
                {
                    overlay: {
                        font_family: 'Arial',
                        font_size: 100,
                        font_weight: 'bold',
                        text: marcaAguaSeeder
                    },
                    color: 'black',
                    opacity: 70
                },
                {
                    width: 0.25,
                    flags: 'relative'
                },
                {
                    flags: 'layer_apply',
                    gravity: 'south_east',
                    x: 0.022,
                    y: 0.022
                },
                {
                    overlay: {
                        font_family: 'Arial',
                        font_size: 100,
                        font_weight: 'bold',
                        text: marcaAguaSeeder
                    },
                    color: 'white',
                    opacity: 95
                },
                {
                    width: 0.25,
                    flags: 'relative'
                },
                {
                    flags: 'layer_apply',
                    gravity: 'south_east',
                    x: 0.02,
                    y: 0.02
                }
            ]
        }
    );

    await Imagen.bulkCreate([
        {
            archivo: "https://res.cloudinary.com/dlvrrops9/image/upload/v1781237614/fotaza2/uujzf0fdqnfycpfslvz1.jpg",
            publicacion_id: publicaciones[0].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },
        {
            archivo: imagenCopyright,
            publicacion_id: publicaciones[1].id,
            licencia: 'copyright',
            marca_de_agua: marcaAguaSeeder,
            comentarios_abiertos: true
        },
        {
            archivo: imagenUsuarioC,
            publicacion_id: publicaciones[2].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },

        {
            archivo: imagenUsuarioD,
            publicacion_id: publicaciones[3].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        }
    ]);
    await Follower.bulkCreate([
        {
            seguidor_id: usuarios[0].id,
            seguido_id: usuarios[1].id
        },
        {
            seguidor_id: usuarios[0].id,
            seguido_id: usuarios[2].id
        }
    ]);
    console.log("Seeders ejecutados correctamente.");
};


export default {
    up: async (queryInterface, Sequelize) => await ejecutarSeed(queryInterface),
    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('publicacion', null, {});
        await queryInterface.bulkDelete('usuario', null, {});
    }
};