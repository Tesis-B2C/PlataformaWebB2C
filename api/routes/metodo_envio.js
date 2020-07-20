'use strict'

const express = require('express');
const MetodoEnvioController = require('../controllers/metodo_envio');
const api = express.Router(); // esto sirve para crear las rutas

api.post('/guardarMetodoEnvio/:id', MetodoEnvioController.guardarMetodoEnvio);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
