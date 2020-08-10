'use stric'

const express = require('express');
const DescuentoController = require('../controllers/descuento');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.post('/saveDescuento/:id', md_auth.ensureAuth,DescuentoController.saveDescuento);
api.get('/getMisDescuentos/:id', md_auth.ensureAuth, DescuentoController.getMisDescuentos);
api.put('/updateEstadoDescuento/:id',md_auth.ensureAuth,DescuentoController.updateEstadoDescuento);
api.get('/getDescuento/:id',md_auth.ensureAuth,DescuentoController.getDescuento);
api.put('/updateDescuento/:id',md_auth.ensureAuth,DescuentoController.updateDescuento);
api.put('/updateEstadoDescuentos/:estado',md_auth.ensureAuth,DescuentoController.updateEstadoDescuentos);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
