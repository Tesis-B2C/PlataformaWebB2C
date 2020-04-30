'use stric'

const express = require('express');
const DpaController = require('../controllers/dpa');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.get('/getDpaProvincias/:id', DpaController.getDpaProvincias);
api.get('/getDpaCiudades/:id', DpaController.getDpaCiudades);


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
