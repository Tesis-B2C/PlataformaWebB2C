'use stric'

const express = require('express');
var TiendaController = require('../controllers/tienda');
var md_auth = require('../middleware/authenticated');
var api = express.Router(); // esto sirve para crear las rutas


api.post('/registrarTienda', TiendaController.registrarTienda);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
