'use stric'

const express = require('express');
var TiendaController = require('../controllers/tienda');
var md_auth = require('../middleware/authenticated');
var api = express.Router(); // esto sirve para crear las rutas
//var multipart = require('connect-multiparty');

const  multer = require('../librerias/multer');
/*var md_upload = multipart({

    uploadDir: './uploads/tienda'
});*/


api.post('/registrarTienda',multer.fields([{name:'logo'},{name: 'banner'}]), TiendaController.registrarTienda);
api.get('/getDatosTienda/:id',TiendaController.getDatosTienda);
api.get('/getMisTiendas/:id',TiendaController.getMisTiendas);
//api.post('/subirImagenesTienda/:id/:tipo',[md_upload],TiendaController.subirImagenesTienda);
/*api.get('/obtenerImagenTienda/:imageFile', TiendaController.obtenerImagenTienda);*/
module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
