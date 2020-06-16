'use strict'

const moment = require('moment');
const TIENDA = require('../models/tienda'); //importar el modelo del usuario  o lo que son las clases comunesvar DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
const SUCURSAL = require('../models/sucursal');
const jwt = require('../services/jwt');
const db = require('../database/db');

const {QueryTypes} = require('sequelize');

async function registrarTienda(req, res) {
    try {
        let json = JSON.stringify(req.body.Tienda);
        console.log("json", json);
        let tienda = await db.sequelize.query("call guardarTienda(:tienda)", {
            replacements: {
                tienda: json,
                type: QueryTypes.SELECT
            }
        });

        res.status(200).send({
            message: "Su tienda ha sido creada"
        });

    } catch (err) {
        res.status(500).send({
            message: err.name
        });
    }
    /* try {

         console.log("ESTO ESTA EN EL BACKEN " + req.body.Tienda);
       /!* let query ='EXECT guardarTienda :@tienda';
         let tiendaRegistrada = await sequelize.query(query, {
             replacements: {
                 tienda: '{"Correo_Agente":"tefo.aguayo@gmail.com"}',
                 type:sequelize.QueryTypes.SELECT
             }
         });*!/


         if (tiendaRegistrada) {
             res.status(200).send({
                 message: 'Correcto'
             });
         } else {
             res.status(500).send({
                 message: 'Error'
             });
         }

     } catch (err) {
         res.status(500).send({
             message: err.name
         });
     }*/
}

module.exports = {          // para exportar todas las funciones de este modulo
    registrarTienda
};
