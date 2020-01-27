'use stric'

const express = require('express');
var AgenteController = require('../controllers/agente');
var md_auth = require('../middleware/authenticated');
var api = express.Router(); // esto sirve para crear las rutas
api.post('/registroAgente', AgenteController.guardarAgente);
/*api.post('/loginDocente', DocenteController.loginDocente);
api.get('/buscarDocentes/:busqueda', md_auth.ensureAuth, DocenteController.busquedaDocentes);
api.put('/update-docente/:id', md_auth.ensureAuth, DocenteController.updateDocente);
api.get('/getListadoDocentes',md_auth.ensureAuth, DocenteController.getDocentes);*/
//pruebas


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
