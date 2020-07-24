'use stric'

const express = require('express');
const DescuentoController = require('../controllers/descuento');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.post('/saveDescuento', DescuentoController.saveDescuento);
api.get('/getMisDescuentos/:id', DescuentoController.getMisDescuentos);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
