const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const { check } = require('express-validator');

// Autenticar un usuario

router.post(
  '/',
  [
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
  ],
  authController.autenticarUsuario
);

router.get('/', authController.usuarioAutenticado);

module.exports = router;
