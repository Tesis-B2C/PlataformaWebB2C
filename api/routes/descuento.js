'use stric'

const express = require('express');
const DescuentoController = require('../controllers/descuento');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
const cache=require('../middleware/cahce');
api.post('/saveDescuento/:id', md_auth.ensureAuth,DescuentoController.saveDescuento);
api.get('/getMisDescuentos/:id', [cache(360),md_auth.ensureAuth], DescuentoController.getMisDescuentos);
api.put('/updateEstadoDescuento/:id',[cache(360),md_auth.ensureAuth],DescuentoController.updateEstadoDescuento);
api.get('/getDescuento/:id',[cache(360),md_auth.ensureAuth],DescuentoController.getDescuento);
api.put('/updateDescuento/:id',md_auth.ensureAuth,DescuentoController.updateDescuento);
api.put('/updateEstadoDescuentos/:estado',[cache(360),md_auth.ensureAuth],DescuentoController.updateEstadoDescuentos);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
