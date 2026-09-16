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
import '../models/Notificacion.js';
import Valoracion from '../models/Valoracion.js';

export const ejecutarSeed = async (queryInterface = null) => {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash('123456', salt);

    // --------------------- ROL ------------------------
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
    // ------------ Usuarios -----------------------
    const usuarios = await User.bulkCreate([
        //usuarios comunes
        { nombre: 'UsuarioA', apellido: 'Demo', email: 'usuarioA@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar1.jpg'},
        { nombre: 'UsuarioB', apellido: 'Demo', email: 'usuarioB@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar2.jpg'},
        { nombre: 'UsuarioC', apellido: 'Demo', email: 'usuarioC@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar1.jpg'},
        { nombre: 'UsuarioD', apellido: 'Demo', email: 'usuarioD@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar2.jpg'},
        
        
        //usuario validador
        {nombre: 'Validador', apellido: 'Demo', email: 'validador@fotaza.com', password_hash: pass, rol_id: rolValidador.id, activo: true}
    ]);

    const [
        usuarioA,
        usuarioB,
        usuarioC,
        usuarioD
    ] = usuarios;
    // ---------- URL Transformada para imagenes con Marca de agua --------------
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

    // ------------------Publicaciones ----------------
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
            titulo: "Diseño Arquitectónico",
            descripcion: "Plano y distribución de un proyecto arquitectónico",
            usuario_id: usuarios[2].id,
            createdAt: new Date('2026-09-13T16:00:00-03:00'),
            updatedAt: new Date('2026-09-13T16:00:00-03:00')
        },

        {
            titulo: "Planificación de espacios",
            descripcion: "Propuesta de distribución y organización de espacios",
            usuario_id: usuarios[3].id,
            createdAt: new Date('2026-09-14T11:30:00-03:00'),
            updatedAt: new Date('2026-09-14T11:30:00-03:00')
        }
    ]);
    console.log("Publicaciones creadas correctamente.");

    // ------------------Tags----------------
    const nombresTags = [
        'paisaje',
        'naturaleza',
        'atardecer',
        'playa',
        'arquitectura',
        'planos',
        'diseño',
        'espacios'
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
        tags['playa']
    ]);

    await publicaciones[2].setTags([
        tags['arquitectura'],
        tags['planos']
    ]);

    await publicaciones[3].setTags([
        tags['diseño'],
        tags['espacios']
    ]);

    //-------------Marca de agua -----------------
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
    // ---------------- IMAGENES ---------------
    const imagenes = await Imagen.bulkCreate([
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
    const [
        imagen1,
        imagen2,
        imagen3,
        imagen4
    ] = imagenes;

    // -------------------Valoraciones ------------------
    await Valoracion.bulkCreate([
        // PUBLICACIÓN A - 3 votos - promedio 4.67  [DESTACADA]
        // Autor: UsuarioA

        {
            usuario_id: usuarioB.id,
            imagen_id: imagen1.id,
            valor: 5
        },
        {
            usuario_id: usuarioC.id,
            imagen_id: imagen1.id,
            valor: 5
        },
        {
            usuario_id: usuarioD.id,
            imagen_id: imagen1.id,
            valor: 4
        },

        // PUBLICACIÓN B - 2 votos - promedio 5.00  [ No Destacada por falta de votos]
        // Autor: UsuarioB
        {
            usuario_id: usuarioA.id,
            imagen_id: imagen2.id,
            valor: 5
        },
        {
            usuario_id: usuarioC.id,
            imagen_id: imagen2.id,
            valor: 5
        },

        // PUBLICACIÓN C - 3 votos - promedio 3.33 - [NO destacada por promedio insuficiente]
        // Autor: UsuarioC
        {
            usuario_id: usuarioA.id,
            imagen_id: imagen3.id,
            valor: 3
        },
        {
            usuario_id: usuarioB.id,
            imagen_id: imagen3.id,
            valor: 3
        },
        {
            usuario_id: usuarioD.id,
            imagen_id: imagen3.id,
            valor: 4
        },


        // ==========================================
        // PUBLICACIÓN D - 3 votos - promedio 4.33 - [Destacada]
        // Autor: UsuarioD

        {
            usuario_id: usuarioA.id,
            imagen_id: imagen4.id,
            valor: 4
        },
        {
            usuario_id: usuarioB.id,
            imagen_id: imagen4.id,
            valor: 5
        },
        {
            usuario_id: usuarioC.id,
            imagen_id: imagen4.id,
            valor: 4
        }
    ]);

    // ------------------Followers ----------------
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