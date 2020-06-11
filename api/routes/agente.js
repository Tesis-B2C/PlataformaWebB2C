'use stric'

const express = require('express');
var AgenteController = require('../controllers/agente');
var md_auth = require('../middleware/authenticated');
var api = express.Router(); // esto sirve para crear las rutas
api.post('/autenticarAgente', AgenteController.autenticarAgente);
api.post('/autenticarActivarAgente',md_auth.ensureAuth, AgenteController.autenticarActivarAgente);

api.post('/registrarAgente', AgenteController.registrarAgente);
api.post('/resetearContrasenia', AgenteController.resetearContrasenia);
api.put('/resetearContrasenia2',md_auth.ensureAuth, AgenteController.resetearContrasenia2);
api.put('/actualizarAgente/:id', AgenteController.actualizarAgente);
api.post('/verificarExistenciaCorreo', AgenteController.verificarExistenciaCorreo);
/*api.get('/buscarDocentes/:busqueda', md_auth.ensureAuth, DocenteController.busquedaDocentes);
api.put('/actualizarAgentee/:id', md_auth.ensureAuth, DocenteController.updateDocente);
api.get('/getListadoDocentes',md_auth.ensureAuth, DocenteController.getDocentes);*/
//pruebas


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
