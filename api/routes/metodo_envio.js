'use strict'

const express = require('express');
const MetodoEnvioController = require('../controllers/metodo_envio');
const api = express.Router(); // esto sirve para crear las rutas
const md_auth = require('../middleware/authenticated');
api.post('/guardarMetodoEnvio/:id',md_auth.ensureAuth, MetodoEnvioController.guardarMetodoEnvio);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
