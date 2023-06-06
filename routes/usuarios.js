const express = require('express');

const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

// Crear un usuario
router.post('/', usuarioController.nuevoUsuario);

module.exports = router;
