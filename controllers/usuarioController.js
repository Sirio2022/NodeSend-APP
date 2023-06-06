const Usuario = require('../models/Usuario');

exports.nuevoUsuario = async (req, res, next) => {
    

    // Verificar si el usuario ya estuvo registrado
    const { email } = req.body;

    const registrado = await Usuario.findOne({ email });

    if (registrado) {
        return res.status(400).json({ msg: 'El usuario ya esta registrado' });
    }

    // Crear objeto de usuario con datos de req.body
    const usuario = await new Usuario(req.body);
    usuario.save();

    res.json({ msg: 'Usuario creado correctamente' });
};