import bcrypt from 'bcrypt';
import User from '../models/Usuario.js';

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

        await User.create({
            nombre: nombre, 
            apellido: apellido,
            email: email,
            password_hash: passHasheada
        });

        res.send('Usuario creado con éxito!');

    } catch(error){
        console.error('Error al registrar usuario: ', error);
        res.send('Hubo un error en el servidor al intentar registrarse.');
    }
};

