const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

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
