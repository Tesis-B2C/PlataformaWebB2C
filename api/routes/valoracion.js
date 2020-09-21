'use stric'

const express = require('express');
const ValoracionController = require('../controllers/valoracion');
const md_auth = require('../middleware/authenticated');
const api = express.Router(); // esto sirve para crear las rutas

api.post('/saveValoracion',md_auth.ensureAuth, ValoracionController.saveValoracion);
api.put('/updateComentario/:id',md_auth.ensureAuth, ValoracionController.updateComentario);
api.delete('/deleteComentario/:id',md_auth.ensureAuth, ValoracionController.deleteComentario);
module.exports = api;// exportamos el router de express para que las routas funcionen por todo el back end
