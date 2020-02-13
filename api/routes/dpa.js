'use stric'

const express = require('express');
var DpaController = require('../controllers/dpa');
var md_auth = require('../middleware/authenticated');
var api = express.Router(); // esto sirve para crear las rutas
api.get('/getDpaProvincias/:id', DpaController.getDpaProvincias);
api.get('/getDpaCiudades/:id', DpaController.getDpaCiudades);
//api.post('/registroAgente', AgenteController.guardarAgente);
/*api.post('/loginDocente', DocenteController.loginDocente);
api.get('/buscarDocentes/:busqueda', md_auth.ensureAuth, DocenteController.busquedaDocentes);
api.put('/update-docente/:id', md_auth.ensureAuth, DocenteController.updateDocente);
api.get('/getListadoDocentes',md_auth.ensureAuth, DocenteController.getDocentes);*/
//pruebas


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
