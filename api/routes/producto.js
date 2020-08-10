'use stric'

const express = require('express');
const ProductoController = require('../controllers/producto');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
const  multer = require('../librerias/multerProducto');

api.post('/saveProducto', multer.array('imagenes'), ProductoController.saveProducto);
api.get('/getMisProductos/:id' , md_auth.ensureAuth, ProductoController.getMisProductos);
api.get('/getProducto/:id',md_auth.ensureAuth,ProductoController.getProducto);
api.get('/obtenerTodosProductos',md_auth.ensureAuth,ProductoController.obtenerTodosProductos);
api.put('/updateProducto/:id', multer.array('imagenes'),ProductoController.updateProducto);
api.put('/updateEstadoProducto/:id',md_auth.ensureAuth,ProductoController.updateEstadoProducto);
api.put('/updateEstadoProductos/:estado',md_auth.ensureAuth,ProductoController.updateEstadoProductos);


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
