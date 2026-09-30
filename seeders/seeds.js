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
        // usuarios comunes
        { nombre: 'UsuarioA', apellido: 'Demo', email: 'usuarioA@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar1.jpg'},
        { nombre: 'UsuarioB', apellido: 'Demo', email: 'usuarioB@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar2.jpg'},
        { nombre: 'UsuarioC', apellido: 'Demo', email: 'usuarioC@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar1.jpg'},
        { nombre: 'UsuarioD', apellido: 'Demo', email: 'usuarioD@fotaza.com', password_hash: pass, rol_id: rolComun.id, avatar: 'https://res.cloudinary.com/tu-cloud/image/upload/v1/avatar2.jpg'},
        
        // usuario validador
        {nombre: 'Validador', apellido: 'Demo', email: 'validador@fotaza.com', password_hash: pass, rol_id: rolValidador.id, activo: true}
    ]);

    const [
        usuarioA,
        usuarioB,
        usuarioC,
        usuarioD
    ] = usuarios;

    // ---------- Función helper para generar URL con watermark copyright ----------
    const generarUrlCopyright = (publicId, textoMarca) => {
        return cloudinary.url(
            publicId,
            {
                secure: true,
                transformation: [
                    // Capa 1: Centro - diagonal principal
                    {
                        overlay: {
                            font_family: 'Arial',
                            font_size: 80,
                            font_weight: 'bold',
                            text: textoMarca
                        },
                        color: 'white',
                        opacity: 30
                    },
                    {
                        width: 0.6,
                        flags: 'relative'
                    },
                    {
                        angle: 45,
                        flags: ['layer_apply', 'no_overflow'],
                        gravity: 'center',
                        x: 0,
                        y: 0
                    },
                    // Capa 2: Esquina superior izquierda
                    {
                        overlay: {
                            font_family: 'Arial',
                            font_size: 50,
                            font_weight: 'bold',
                            text: textoMarca
                        },
                        color: 'white',
                        opacity: 25
                    },
                    {
                        width: 0.35,
                        flags: 'relative'
                    },
                    {
                        angle: -30,
                        flags: ['layer_apply', 'no_overflow'],
                        gravity: 'north_west',
                        x: 0.05,
                        y: 0.05
                    },
                    // Capa 3: Esquina superior derecha
                    {
                        overlay: {
                            font_family: 'Arial',
                            font_size: 50,
                            font_weight: 'bold',
                            text: textoMarca
                        },
                        color: 'white',
                        opacity: 25
                    },
                    {
                        width: 0.35,
                        flags: 'relative'
                    },
                    {
                        angle: 30,
                        flags: ['layer_apply', 'no_overflow'],
                        gravity: 'north_east',
                        x: 0.05,
                        y: 0.05
                    },
                    // Capa 4: Esquina inferior izquierda
                    {
                        overlay: {
                            font_family: 'Arial',
                            font_size: 50,
                            font_weight: 'bold',
                            text: textoMarca
                        },
                        color: 'white',
                        opacity: 25
                    },
                    {
                        width: 0.35,
                        flags: 'relative'
                    },
                    {
                        angle: 30,
                        flags: ['layer_apply', 'no_overflow'],
                        gravity: 'south_west',
                        x: 0.05,
                        y: 0.05
                    },
                    // Capa 5: Esquina inferior derecha
                    {
                        overlay: {
                            font_family: 'Arial',
                            font_size: 50,
                            font_weight: 'bold',
                            text: textoMarca
                        },
                        color: 'white',
                        opacity: 25
                    },
                    {
                        width: 0.35,
                        flags: 'relative'
                    },
                    {
                        angle: -30,
                        flags: ['layer_apply', 'no_overflow'],
                        gravity: 'south_east',
                        x: 0.05,
                        y: 0.05
                    },
                    // Capa 6: Centro-izquierda
                    {
                        overlay: {
                            font_family: 'Arial',
                            font_size: 45,
                            font_weight: 'bold',
                            text: textoMarca
                        },
                        color: 'white',
                        opacity: 20
                    },
                    {
                        width: 0.3,
                        flags: 'relative'
                    },
                    {
                        angle: 45,
                        flags: ['layer_apply', 'no_overflow'],
                        gravity: 'west',
                        x: 0.1,
                        y: -0.15
                    },
                    // Capa 7: Centro-derecha
                    {
                        overlay: {
                            font_family: 'Arial',
                            font_size: 45,
                            font_weight: 'bold',
                            text: textoMarca
                        },
                        color: 'white',
                        opacity: 20
                    },
                    {
                        width: 0.3,
                        flags: 'relative'
                    },
                    {
                        angle: -45,
                        flags: ['layer_apply', 'no_overflow'],
                        gravity: 'east',
                        x: -0.1,
                        y: 0.15
                    }
                ]
            }
        );
    };

    const generarMarcaAgua = (usuario) => {
        return `© ${usuario.nombre} ${usuario.apellido}`;
    };

    // ------------------Publicaciones ----------------
    const publicaciones = await Publicacion.bulkCreate([
        { 
            titulo: "PETS", 
            descripcion: "Una colección de mascotas y momentos adorables.", 
            usuario_id: usuarioA.id, 
            createdAt: new Date('2026-09-10T12:00:00-03:00'), 
            updatedAt: new Date('2026-09-10T12:00:00-03:00')
        },
        { titulo: "Momentos urbanos", 
            descripcion: "Retratos, música y movimiento capturados en distintos momentos de la ciudad.", 
            usuario_id: usuarioB.id,
            createdAt: new Date('2026-09-12T18:30:00-03:00'), 
            updatedAt: new Date('2026-09-12T18:30:00-03:00')
        },
        {
            titulo: "Paisajes naturales",
            descripcion: "Montañas, horizontes y rincones para detenerse a mirar.",
            usuario_id: usuarioC.id,
            createdAt: new Date('2026-09-13T16:00:00-03:00'),
            updatedAt: new Date('2026-09-13T16:00:00-03:00')
        },

        {
            titulo: "Aire libre",
            descripcion: "Movimiento, deporte y color en espacios abiertos.",
            usuario_id: usuarioD.id,
            createdAt: new Date('2026-09-14T11:30:00-03:00'),
            updatedAt: new Date('2026-09-14T11:30:00-03:00')
        }
    ]);
    console.log("Publicaciones creadas correctamente.");

    // ------------------Tags----------------
    const nombresTags = [
        'mascotas',
        'animales',
        'pets',
        'fotografia',
        'urbano',
        'personas',
        'retrato',
        'movimiento',
        'paisaje',
        'naturaleza',
        'montañas',
        'viaje',
        'deporte',
        'aire-libre',
        'actividad',
        'color'
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
        tags['mascotas'],
        tags['animales'],
        tags['pets'],
        tags['fotografia']
    ]);

    await publicaciones[1].setTags([
        tags['urbano'],
        tags['personas'],
        tags['retrato'],
        tags['movimiento']
    ]);

    await publicaciones[2].setTags([
        tags['paisaje'],
        tags['naturaleza'],
        tags['montañas'],
        tags['viaje']
    ]);

    await publicaciones[3].setTags([
        tags['deporte'],
        tags['aire-libre'],
        tags['actividad'],
        tags['color']
    ]);

    // ---------- Preparar marcas de agua para cada autor ----------
    const marcaAguaB = generarMarcaAgua(usuarioB);
    const marcaAguaC = generarMarcaAgua(usuarioC);
    const marcaAguaD = generarMarcaAgua(usuarioD);

    // ---------- Generar URLs con watermark para imágenes copyright ----------
    // Publicación B - MOMENTOS URBANOS
    const urlB1 = generarUrlCopyright('samples/people/jazz', marcaAguaB);
    const urlB3 = generarUrlCopyright('samples/people/smiling-man', marcaAguaB);

    // Publicación C - PAISAJES NATURALES
    const urlC3 = generarUrlCopyright('fotaza2/nvlwnrm68ssu89vpfity', marcaAguaC);

    // Publicación D - AIRE LIBRE
    const urlD1 = generarUrlCopyright('samples/woman-on-a-football-field', marcaAguaD);
    const urlD2 = generarUrlCopyright('samples/balloons', marcaAguaD);

    // ---------------- IMAGENES ---------------
    // Publicación A (PETS) - 4 imágenes, todas sin_copyright
    // Publicación B (MOMENTOS URBANOS) - 3 imágenes: B1 copyright, B2 sin_copyright, B3 copyright
    // Publicación C (PAISAJES NATURALES) - 3 imágenes: C1 sin_copyright, C2 sin_copyright, C3 copyright
    // Publicación D (AIRE LIBRE) - 2 imágenes: ambas copyright
    const imagenes = await Imagen.bulkCreate([
        // PUBLICACIÓN A - PETS
        {
            archivo: 'https://res.cloudinary.com/dlvrrops9/image/upload/v1781230785/samples/animals/kitten-playing.gif',
            publicacion_id: publicaciones[0].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },
        {
            archivo: 'https://res.cloudinary.com/dlvrrops9/image/upload/v1781230782/samples/animals/three-dogs.jpg',
            publicacion_id: publicaciones[0].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },
        {
            archivo: 'https://res.cloudinary.com/dlvrrops9/image/upload/v1781230794/main-sample.png',
            publicacion_id: publicaciones[0].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },
        {
            archivo: 'https://res.cloudinary.com/dlvrrops9/image/upload/v1781230793/cld-sample.jpg',
            publicacion_id: publicaciones[0].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },

        // PUBLICACIÓN B - MOMENTOS URBANOS
        {
            archivo: urlB1,
            publicacion_id: publicaciones[1].id,
            licencia: 'copyright',
            marca_de_agua: marcaAguaB,
            comentarios_abiertos: true
        },
        {
            archivo: 'https://res.cloudinary.com/dlvrrops9/image/upload/v1781230781/samples/bike.jpg',
            publicacion_id: publicaciones[1].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },
        {
            archivo: urlB3,
            publicacion_id: publicaciones[1].id,
            licencia: 'copyright',
            marca_de_agua: marcaAguaB,
            comentarios_abiertos: true
        },

        // PUBLICACIÓN C - PAISAJES NATURALES
        {
            archivo: 'https://res.cloudinary.com/dlvrrops9/image/upload/v1781230784/samples/landscapes/nature-mountains.jpg',
            publicacion_id: publicaciones[2].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },
        {
            archivo: 'https://res.cloudinary.com/dlvrrops9/image/upload/v1781230785/samples/landscapes/landscape-panorama.jpg',
            publicacion_id: publicaciones[2].id,
            licencia: 'sin_copyright',
            marca_de_agua: null,
            comentarios_abiertos: true
        },
        {
            archivo: urlC3,
            publicacion_id: publicaciones[2].id,
            licencia: 'copyright',
            marca_de_agua: marcaAguaC,
            comentarios_abiertos: true
        },

        // PUBLICACIÓN D - AIRE LIBRE
        {
            archivo: urlD1,
            publicacion_id: publicaciones[3].id,
            licencia: 'copyright',
            marca_de_agua: marcaAguaD,
            comentarios_abiertos: true
        },
        {
            archivo: urlD2,
            publicacion_id: publicaciones[3].id,
            licencia: 'copyright',
            marca_de_agua: marcaAguaD,
            comentarios_abiertos: true
        }
    ]);
    console.log("Imágenes creadas correctamente.");

    // Identificar imágenes principales para valoraciones
    // imagenes[0] = PETS principal (kitten-playing)
    // imagenes[4] = MOMENTOS URBANOS principal (jazz)
    // imagenes[7] = PAISAJES NATURALES principal (nature-mountains)
    // imagenes[10] = AIRE LIBRE principal (woman-on-a-football-field)
    const imagenPetsPrincipal = imagenes[0];
    const imagenUrbanaPrincipal = imagenes[4];
    const imagenPaisajePrincipal = imagenes[7];
    const imagenAireLibrePrincipal = imagenes[10];

    // -------------------Valoraciones ------------------
    await Valoracion.bulkCreate([
        // PUBLICACIÓN A - 3 votos - promedio 4.67  [DESTACADA]
        // Autor: UsuarioA - Imagen principal: kitten-playing
        {
            usuario_id: usuarioB.id,
            imagen_id: imagenPetsPrincipal.id,
            valor: 5
        },
        {
            usuario_id: usuarioC.id,
            imagen_id: imagenPetsPrincipal.id,
            valor: 5
        },
        {
            usuario_id: usuarioD.id,
            imagen_id: imagenPetsPrincipal.id,
            valor: 4
        },

        // PUBLICACIÓN B - 2 votos - promedio 5.00  [No Destacada por falta de votos]
        // Autor: UsuarioB - Imagen principal: jazz
        {
            usuario_id: usuarioA.id,
            imagen_id: imagenUrbanaPrincipal.id,
            valor: 5
        },
        {
            usuario_id: usuarioC.id,
            imagen_id: imagenUrbanaPrincipal.id,
            valor: 5
        },

        // PUBLICACIÓN C - 3 votos - promedio 3.33 - [NO destacada por promedio insuficiente]
        // Autor: UsuarioC - Imagen principal: nature-mountains
        {
            usuario_id: usuarioA.id,
            imagen_id: imagenPaisajePrincipal.id,
            valor: 3
        },
        {
            usuario_id: usuarioB.id,
            imagen_id: imagenPaisajePrincipal.id,
            valor: 3
        },
        {
            usuario_id: usuarioD.id,
            imagen_id: imagenPaisajePrincipal.id,
            valor: 4
        },

        // PUBLICACIÓN D - 3 votos - promedio 4.33 - [Destacada]
        // Autor: UsuarioD - Imagen principal: woman-on-a-football-field
        {
            usuario_id: usuarioA.id,
            imagen_id: imagenAireLibrePrincipal.id,
            valor: 4
        },
        {
            usuario_id: usuarioB.id,
            imagen_id: imagenAireLibrePrincipal.id,
            valor: 5
        },
        {
            usuario_id: usuarioC.id,
            imagen_id: imagenAireLibrePrincipal.id,
            valor: 4
        }
    ]);
    console.log("Valoraciones creadas correctamente.");

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