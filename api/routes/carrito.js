'use stric'

const express = require('express');
const CarritoController = require('../controllers/carrito');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.get('/getCarrito/:id', md_auth.ensureAuth, CarritoController.getCarrito);
api.post('/saveCarrito/:id',md_auth.ensureAuth, CarritoController.saveCarrito);


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
