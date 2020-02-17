'use strcit'

const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
var AGENTE = require('../models/agente'); //importar el modelo del usuario  o lo que son las clases comunes
var jwt = require('../services/jwt');
var mysql = require('mysql');

async function registrarAgente(req, res) {

    const datosAgente = {
        ID_AGENTE: req.body.Id_Agente,
        NOMBRE: req.body.Nombre,
        TELEFONO: req.body.Telefono,
        CORREO: req.body.Correo,
        NUM_COD_POSTAL: req.body.Num_Cod_Postal,
        TIPO: req.body.Tipo,
        ESTADO: req.body.Estado,
        CALLE_PRINCIPAL_AGENTE: req.body.Calle_Principal_Agente,
        CALLE_SECUNDARIA_AGENTE: req.body.Calle_Secundaria_Agente,
        NUM_CASA_AGENTE:  req.body.Num_Casa.Agente,
        CONTRASENIA: req.body.Contrasenia
    }
    try {
        let agenteRegistrado = await AGENTE.create(datosAgente);
        if (!agenteRegistrado) {
            res.status(404).send({
                message: 'No se ha registrado el Agente'
            });
        } else {
            res.status(200).send({
                message: 'El Agente se ha registrado correctamente',
                data: agenteRegistrado
            });
        }

    } catch (err) {

        res.status(500).send({
            message: 'error:' + err
        });

    }


}


module.exports = {          // para exportar todas las funciones de este modulo

    registrarAgente,

};
