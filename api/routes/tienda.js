'use stric'

const express = require('express');
var TiendaController = require('../controllers/tienda');
var md_auth = require('../middleware/authenticated');
var api = express.Router(); // esto sirve para crear las rutas
var multipart = require('connect-multiparty');
var md_upload = multipart({

    uploadDir: './api/uploads/tienda'
});


api.post('/registrarTienda',TiendaController.registrarTienda);
api.post('/subirImagenesTienda',[md_upload],TiendaController.subirImagenesTienda);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
