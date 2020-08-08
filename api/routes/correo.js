'use strcit'

var express= require('express');

var CorreoCtroller = require('../controllers/correo1');
var api = express.Router(); // esto sirve para crear las rutas
//email route
api.post('/correoActivacion', CorreoCtroller.correoActivacion);
api.post('/correoCambioContrasenia', CorreoCtroller.correoCambioContrasenia);
api.post('/correoCambioCorreo', CorreoCtroller.correoCambioCorreo);

module.exports = api;
