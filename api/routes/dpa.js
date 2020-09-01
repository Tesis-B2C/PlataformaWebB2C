'use stric'

const express = require('express');
const DpaController = require('../controllers/dpa');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
const cache=require('../middleware/cahce');
api.get('/getDpaProvincias/:id',cache(360), DpaController.getDpaProvincias);
api.get('/getDpaCiudades/:id',cache(360), DpaController.getDpaCiudades);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
