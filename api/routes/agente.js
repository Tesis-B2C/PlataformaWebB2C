'use stric'

const express = require('express');
const AgenteController = require('../controllers/agente');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas
const cache=require('../middleware/cahce');
api.post('/autenticarAgente', AgenteController.autenticarAgente);
api.post('/autenticarActivarAgente',md_auth.ensureAuth, AgenteController.autenticarActivarAgente);

api.post('/registrarAgente', AgenteController.registrarAgente);
api.post('/resetearContrasenia', AgenteController.resetearContrasenia);
api.put('/resetearContrasenia2',md_auth.ensureAuth, AgenteController.resetearContrasenia2);
api.put('/actualizarAgente/:id',md_auth.ensureAuth, AgenteController.actualizarAgente);
api.post('/verificarExistenciaCorreo', [cache(360),md_auth.ensureAuth],AgenteController.verificarExistenciaCorreo);
api.put('/cambioCorreoAgente/:id',  md_auth.ensureAuth, AgenteController.cambioCorreoAgente);
api.get('/actualizarAgenteIdentity/:id', [cache(360),md_auth.ensureAuth], AgenteController.actualizarAgenteIdentity);
api.put('/actualizarContrasenia/:id', md_auth.ensureAuth, AgenteController.actualizarContrasenia);

/*api.get('/buscarDocentes/:busqueda', md_auth.ensureAuth, DocenteController.busquedaDocentes);
api.put('/actualizarAgentee/:id', md_auth.ensureAuth, DocenteController.updateDocente);
api.get('/getListadoDocentes',md_auth.ensureAuth, DocenteController.getDocentes);*/
//pruebas


module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
