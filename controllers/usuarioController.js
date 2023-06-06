const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.nuevoUsuario = async (req, res, next) => {
    // Mostrar mensajes de error de express validator
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }





  // Verificar si el usuario ya estuvo registrado
  const { email, password } = req.body;

  const registrado = await Usuario.findOne({ email });

  if (registrado) {
    return res.status(400).json({ msg: 'El usuario ya esta registrado' });
  }

  // Crear objeto de usuario con datos de req.body
  const usuario = new Usuario(req.body);

  // Hashear el password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);

  // Guardar usuario

  try {
    await usuario.save();

    res.json({ msg: 'Usuario creado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(400).send('Hubo un error');
  }
};
