'use strict';
import bcrypt from 'bcrypt';
import User from '../models/Usuario.js';
import Publicacion from '../models/Publicacion.js';
import Imagen from '../models/Imagen.js';
import Rol from '../models/Rol.js';

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

    const publicaciones = await Publicacion.bulkCreate([
        { titulo: "Mi primer post", descripcion: "Foto increíble", usuario_id: usuarios[0].id },
        { titulo: "Atardecer en San Luis", descripcion: "Disfrutando el paisaje", usuario_id: usuarios[1].id }
    ]);
    console.log("Publicaciones creadas correctamente.");

    await Imagen.bulkCreate([
        {
            archivo: "https://res.cloudinary.com/dlvrrops9/image/upload/v1781237614/fotaza2/uujzf0fdqnfycpfslvz1.jpg",
            publicacion_id: publicaciones[0].id,
            licencia: 'sin_copyright',
            marca_de_agua: null
        },
        {
            archivo: "https://res.cloudinary.com/dlvrrops9/image/upload/v1781279773/fotaza2/h5fogrnyvx3ua3y4xc3h.jpg",
            publicacion_id: publicaciones[1].id,
            licencia: 'copyright',
            marca_de_agua: '© UsuarioB'
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