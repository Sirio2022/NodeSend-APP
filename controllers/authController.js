const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });
const { validationResult } = require('express-validator');

exports.autenticarUsuario = async (req, res, next) => {
  // Mostrar mensajes de error de express validator
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // Buscar el usuario para ver si esta registrado
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    res.status(401).json({ msg: 'El usuario no existe' });
    return next();
  }

  // Verificar el password y autenticar el usuario
  if (bcrypt.compareSync(password, usuario.password)) {
    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );
    res.status(200).json({ token });
  } else {
    res.status(401).json({ msg: 'Password incorrecto' });
    return next();
  }
};

exports.usuarioAutenticado = async (req, res, next) => {
  res.status(200).json({ usuario: req.usuario });
};
