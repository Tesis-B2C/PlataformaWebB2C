'use stric'

const express = require('express');
const NotificacionController = require('../controllers/notificacion');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas

api.get('/getMisNotificaciones',md_auth.ensureAuth, NotificacionController.getMisNotificaciones);

module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
