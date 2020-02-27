'use strcit'

const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
var AGENTE = require('../models/agente'); //importar el modelo del usuario  o lo que son las clases comunes
var CODIGO_POSTAL = require('../models/codigo_postal'); //importar el modelo del usuario  o lo que son las clases comunes
var jwt = require('../services/jwt');
var mysql = require('mysql');

async function registrarAgente(req, res) {
    try {
        let datosAgente = {
            ID_AGENTE: req.body.Id_Agente,
            NOMBRE: req.body.Nombre,
            TELEFONO: req.body.Telefono,
            CORREO: req.body.Correo,
            NUM_COD_POSTAL: req.body.Num_Cod_Postal,
            TIPO: req.body.Tipo,
            ESTADO: req.body.Estado,
            CALLE_PRINCIPAL_AGENTE: req.body.Calle_Principal_Agente,
            CALLE_SECUNDARIA_AGENTE: req.body.Calle_Secundaria_Agente,
            NUM_CASA_AGENTE: req.body.Num_Casa_Agente,
            CONTRASENIA: req.body.Contrasenia
        }

        let datosCodigoPostal = {
            NUM_COD_POSTAL: req.body.Num_Cod_Postal,
            COD_DPA: req.body.Ciudad
        }

        await bcrypt.hash(req.body.contrasena, null, null, function (err, hash) {
            datosAgente.CONTRASENIA = hash;
        });

        await AGENTE.findOrCreate({
            where: {ID_AGENTE: req.body.Id_Agente, CORREO: req.body.Correo}, defaults: datosAgente // default se pone cuando no se compara todos los parametros anterior mente
        }).spread(function (agente, creado) {
            if (creado) {
                if (req.body.Num_Cod_Postal != null) {
                    CODIGO_POSTAL.findOrCreate({
                        where: {NUM_COD_POSTAL: req.body.Num_Cod_Postal, COD_DPA: req.body.Ciudad}, datosCodigoPostal // aqui no se poen default por que comparamos el objeto entero
                    }).spread(function (codigo_postal, creado) {
                        if (creado || !creado) {
                            res.status(200).send({
                                message: 'Los datos han sido registrados exitosamente',
                            });
                        }
                    });
                } else {
                    res.status(200).send({
                        message: 'No se ha registrado una direccion aun, esperamos lo puedas hacer pronto'
                    });
                }
            } else {
                res.status(404).send({
                    message: 'Usuario ya Existe Intente con otro correo u otra cedula'
                });
            }
        });

    } catch (err) {
        res.status(500).send({
            message: err.name
        });
    }
}


module.exports = {          // para exportar todas las funciones de este modulo

    registrarAgente,

};
