const Enlaces = require('../models/Enlace');
const { validationResult } = require('express-validator');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

exports.nuevoEnlace = async (req, res, next) => {
  // Revisar si hay errores
  const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

  // Almacenar el enlace en la base de datos
  const { nombre_original } = req.body;

  // Crear un objeto de enlace
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = shortid.generate();
  enlace.nombre_original = nombre_original;

  // Si el usuario esta autenticado
  if (req.usuario) {
    const { password, descargas } = req.body;

    // Asignar al enlace en numero de descargas
    if (descargas) {
      enlace.descargas = descargas;
    }

    // Asignar un password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      enlace.password = await bcrypt.hash(password, salt);
    }

    // Asignar el autor
    enlace.autor = req.usuario.id;
  }

  // Almacenar en la base de datos
  try {
    await enlace.save();
    res.json({ msg: `${enlace.url}` });
    return next();
  } catch (error) {
    console.log(error);
  }
};
