'use stric'

const express = require('express');
const CategoriaControllers = require('../controllers/categoria');
const md_auth = require('../middleware/authenticated');
const cache=require('../middleware/cahce');
const api = express.Router(); // esto sirve para crear las rutas
api.get('/getCategorias', cache(360), CategoriaControllers.getCategorias);



module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
