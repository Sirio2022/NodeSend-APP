const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {
  const configuracionMulter = {
    limits: { fileSize: req.usuario ? 1000000000 : 10000000 },
    storage: (fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads/');
      },
      filename: (req, file, cb) => {
        const fileExtension = file.originalname.substring(
          file.originalname.lastIndexOf('.'),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${fileExtension}`);
      },
    })),
  };

  const upload = multer(configuracionMulter).single('archivo');

  upload(req, res, async function (error) {
    if (!error) {
      res.json({ archivo: req.file.filename });
    } else {
      console.log(error);
      return next();
    }
  });
};

exports.eliminarArchivo = async (req, res, next) => {
  try {
    fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
    console.log('Archivo eliminado');
  } catch (error) {
    console.log(error);
  }
};

// Descarga un archivo
exports.descargar = async (req, res, next) => {
  // Obtiene el enlace
  const { archivo } = req.params;
  const enlace = await Enlaces.findOne({ nombre: archivo });
 

  const file = __dirname + '/../uploads/' + archivo;
  res.download(file);

  // Eliminar el archivo y la entrada de la base de datos
  // Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo
  const { descargas, nombre } = enlace;
  if (descargas === 1) {
    // Eliminar el archivo
    req.archivo = nombre;
    // Eliminar la entrada de la base de datos
    await Enlaces.findOneAndRemove(enlace.id);
    next();
  } else {
    // Si las descargas son mayores a 1 - Restar 1 a las descargas
    enlace.descargas--;
    await enlace.save();
  }
};
