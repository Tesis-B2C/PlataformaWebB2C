'use stric'

const express = require('express');
const EstadisticasController = require('../controllers/estadisticas');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
api.get('/getVentas/:id',md_auth.ensureAuth, EstadisticasController.getVentas);
api.get('/getCalificaciones/:id',md_auth.ensureAuth, EstadisticasController.getCalificaciones);
api.get('/getProductos/:id',md_auth.ensureAuth, EstadisticasController.getProductos);
api.get('/getVisitas/:id',md_auth.ensureAuth, EstadisticasController.getVisitas);
api.get('/getMetodosPago/:id',md_auth.ensureAuth, EstadisticasController.getMetodosPago);
api.get('/getMetodosEnvio/:id',md_auth.ensureAuth, EstadisticasController.getMetodosEnvio);
api.get('/getDescuentos/:id',md_auth.ensureAuth, EstadisticasController.getDescuentos);
api.get('/getVentasMensuales/:id',md_auth.ensureAuth, EstadisticasController.getVentasMensuales);
api.get('/getVentasVisitas/:id',md_auth.ensureAuth, EstadisticasController.getVentasVisitas);
api.get('/getProductoMasVendido/:id',md_auth.ensureAuth, EstadisticasController.getProductoMasVendido);
api.get('/getProductoDetalleMasVendido/:id',md_auth.ensureAuth, EstadisticasController.getProductoDetalleMasVendido);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
