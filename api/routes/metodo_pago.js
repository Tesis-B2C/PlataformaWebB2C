'use stric'

const express = require('express');
const MetodoPagoController = require('../controllers/metodo_pago');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.post('/saveMetodosPago/:id', MetodoPagoController.saveMetodosPago);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
