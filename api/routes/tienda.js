'use strict'

const express = require('express');
const TiendaController = require('../controllers/tienda');
const md_auth = require('../middleware/authenticated');
const cache=require('../middleware/cahce');
const api = express.Router(); // esto sirve para crear las rutas
//var multipart = require('connect-multiparty');

const multer = require('../librerias/multer');
/*var md_upload = multipart({

    uploadDir: './uploads/tienda'
});*/


api.post('/registrarTienda', multer.fields([{name: 'logo'}, {name: 'banner'}]), TiendaController.registrarTienda);
api.get('/getDatosTienda/:id', [ md_auth.ensureAuth], TiendaController.getDatosTienda);
api.get('/getMisTiendas/:id',[ md_auth.ensureAuth], TiendaController.getMisTiendas);
api.put('/actualizarTiendaGeneral/:id',[ md_auth.ensureAuth], TiendaController.actualizarTiendaGeneral);
api.put('/actualizarTiendaSucursal/:id',[md_auth.ensureAuth], TiendaController.actualizarTiendaSucursal);
api.put('/updateEstadoTienda/:id', [md_auth.ensureAuth], TiendaController.updateEstadoTienda);
api.put('/updatePersonalizacionTienda/:id', multer.fields([{name: 'logo'}, {name: 'banner'}]), TiendaController.updatePersonalizacionTienda);
api.get('/getDetalleTiendaProducto/:id',TiendaController.getDetalleTiendaProducto);
api.get('/obtenerFiltroPrincipalTodos/:termino', TiendaController.obtenerFiltroPrincipalTodos);
api.get('/obtenerFiltroPrincipalTienda/:termino', TiendaController.obtenerFiltroPrincipalTienda);
api.get('/obtenerFiltroPrincipalProductos/:termino', TiendaController.obtenerFiltroPrincipalProductos);
api.get('/obtenerTodasTiendas',TiendaController.obtenerTodasTiendas);
api.get('/obtenerFiltroBusquedaTodos/:termino', TiendaController.obtenerFiltroBusquedaTodos);

//api.post('/subirImagenesTienda/:id/:tipo',[md_upload],TiendaController.subirImagenesTienda);
/*api.get('/obtenerImagenTienda/:imageFile', TiendaController.obtenerImagenTienda);*/
module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
