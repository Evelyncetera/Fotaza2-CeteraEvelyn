import bcrypt from 'bcrypt';
import User from '../models/Usuario.js';
import Rol from '../models/Rol.js';

export const mostrarUsuario = (req,res) => {
    res.render('auth/registro');
};

export const registroUsuario = async (req, res) => {
    const {nombre, apellido, email, password, repetir_password } = req.body;

    try {
        if(password !== repetir_password) {
            return res.send('Las contraseñas no coinciden. Intentá nuevamente')
        }

        const userExistente = await User.findOne({ where: { email: email}});
        if (userExistente) {
            return res.send('El mail ya está registrado.');
        }

        const salt = await bcrypt.genSalt(10);
        const passHasheada = await bcrypt.hash(password, salt);

        const rolComun = await Rol.findOne({
            where: {
                nombre: 'comun'
            }
        });

        if (!rolComun) {
            return res.status(500).send(
                'No se encontró el rol de usuario común.'
            );
        }

        await User.create({
            nombre,
            apellido,
            email,
            password_hash: passHasheada,
            rol_id: rolComun.id
        });

        res.send('Usuario creado con éxito!');

    } catch(error){
        console.error('Error al registrar usuario: ', error);
        res.send('Hubo un error en el servidor al intentar registrarse.');
    }
};

export const mostrarLogin = (req, res) => {
    res.render('auth/login');
};

export const validarUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await User.findOne({ where: { email } });
        
        if (!usuario) {
            return res.send('El usuario no existe.');
        }

        const esCorrecta = await bcrypt.compare(password, usuario.password_hash);

        if (!esCorrecta) {
            return res.send('Contraseña incorrecta.');
        }

        req.session.usuarioId = usuario.id;
        res.redirect('/');

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.send('Error en el servidor.');
    }
};

export const cerrarSesion = (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return res.send(
                'Error al cerrar sesión'
            );
        }

        res.redirect('/');
    });
};