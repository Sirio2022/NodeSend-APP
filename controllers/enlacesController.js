const Enlaces = require('../models/Enlace');
const { validationResult } = require('express-validator');
const shortid = require('shortid');
const bcrypt = require('bcrypt');

exports.nuevoEnlace = async (req, res, next) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  //console.log(req.body);

  // Almacenar el enlace en la base de datos
  const { nombre_original, nombre } = req.body;

  // Crear un objeto de enlace
  const enlace = new Enlaces();
  enlace.url = shortid.generate();
  enlace.nombre = nombre;
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

// Obtener enlace
exports.obtenerEnlace = async (req, res, next) => {
  // Verificar si existe el enlace
  const { url } = req.params;
  const enlace = await Enlaces.findOne({ url });
  if (!enlace) {
    res.status(404).json({ msg: 'Ese enlace no existe' });
    return next();
  }

  // Si el enlace existe
  res.status(200).json({ archivo: enlace.nombre });

  // Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo
  const { descargas, nombre } = enlace;
  if (descargas === 1) {
    // Eliminar el archivo
    req.archivo = nombre;
    // Eliminar la entrada de la base de datos
    await Enlaces.findOneAndRemove(req.params.url);
    next();
  } else {
    // Si las descargas son mayores a 1 - Restar 1 a las descargas
    enlace.descargas--;
    await enlace.save();
  }
};
