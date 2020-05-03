'use stric'

const express = require('express');
const UnidadMedidaController = require('../controllers/unidad_medida');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.get('/getUnidadesMedida', UnidadMedidaController.getUnidadesMedida);



module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
