'use stric'

const express = require('express');
const EstadisticasController = require('../controllers/estadisticas');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.get('/getDpaProvincias/:id',md_auth.ensureAuth, EstadisticasController.getVentas);


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
