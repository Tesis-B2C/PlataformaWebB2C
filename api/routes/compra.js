'use stric'
const express = require('express');
const CompraController = require('../controllers/compra');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.post('/saveComprarProducto',md_auth.ensureAuth, CompraController.saveComprarProducto);
api.post('/saveComprarProductoCarrito',md_auth.ensureAuth, CompraController.saveComprarProductoCarrito);
api.get('/getMisCompras/:estado/:meses',md_auth.ensureAuth, CompraController.getMisCompras);


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end

