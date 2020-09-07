'use stric'

const express = require('express');
const CarritoController = require('../controllers/carrito');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.get('/getCarrito', md_auth.ensureAuth, CarritoController.getCarrito);
api.post('/saveCarrito',md_auth.ensureAuth, CarritoController.saveCarrito);
api.put('/updateCantidadProducto/:num_variante',md_auth.ensureAuth,CarritoController.updateCantidadProducto);
api.delete('/deleteProductoCarrito/:num_variante',md_auth.ensureAuth,CarritoController.deleteProductoCarrito);


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
