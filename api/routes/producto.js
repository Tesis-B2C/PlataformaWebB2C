'use stric'

const express = require('express');
const ProductoController = require('../controllers/producto');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
const  multer = require('../librerias/multerProducto');

api.post('/saveProducto', multer.array('imagenes'), ProductoController.saveProducto);
api.get('/getMisProductos/:id',ProductoController.getMisProductos);
api.get('/getProducto/:id',ProductoController.getProducto);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
