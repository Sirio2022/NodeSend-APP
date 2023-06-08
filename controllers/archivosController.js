const multer = require('multer');
const shortid = require('shortid');

exports.subirArchivo = async (req, res, next) => {
  const configuracionMulter = {
    limits: { fileSize: req.usuario ? 100000000 : 2000000 },
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
    console.log(req.file);
    if (!error) {
      res.json({ archivo: req.file.filename });
    } else {
      console.log(error);
      return next();
    }
    return next();
  });
};

exports.eliminarArchivo = async (req, res, next) => {};
