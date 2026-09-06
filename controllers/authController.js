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
            req.session.mensaje = 'Las contraseñas no coinciden. Intentá nuevamente';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/auth/registro');
        }

        const userExistente = await User.findOne({ 
            where: { 
                email: email
            }
        });

        if (userExistente) {

            req.session.mensaje = 'El mail ya está registrado.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/auth/registro');
        }

        const salt = await bcrypt.genSalt(10);
        const passHasheada = await bcrypt.hash(password, salt);

        const rolComun = await Rol.findOne({
            where: {
                nombre: 'comun'
            }
        });

        if (!rolComun) {

            return next( new Error ('No se encontró el rol de usuario común.'));
        }

        await User.create({
            nombre,
            apellido,
            email,
            password_hash: passHasheada,
            rol_id: rolComun.id
        });

        req.session.mensaje = 'Usuario creado con éxito!';
        req.session.tipoMensaje = 'success';

        return res.redirect('/auth/login');

    } catch(error){
        console.error('Error al registrar usuario: ', error);
        next(error);
    }
};

export const mostrarLogin = (req, res) => {
    res.render('auth/login');
};

export const validarUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await User.findOne({ 
            where: { email }, 
            include: [
                        {
                            model: Rol,
                            as: 'rol'
                        }
                    ]
        });
        
        if (!usuario) {
            req.session.mensaje = 'No existe un usuario registrado con ese correo.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/auth/login');
        }

        const esCorrecta = await bcrypt.compare(password, usuario.password_hash);

        if (!esCorrecta) {
            
            req.session.mensaje ='La contraseña ingresada es incorrecta.';
            req.session.tipoMensaje = 'warning';

            return res.redirect('/auth/login');
        }

        if (!usuario.activo) {
            req.session.mensaje ='Tu cuenta se encuentra inactiva debido a reiteradas infracciones. No podés iniciar sesión.';
            req.session.tipoMensaje = 'danger';

            return res.redirect('/auth/login');
        }

        req.session.usuarioId = usuario.id;
        req.session.usuarioRol = usuario.rol.nombre;
        res.redirect('/');

    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        next(error);
    }
};

export const cerrarSesion = (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return next(error);
        }

        res.redirect('/');
    });
};