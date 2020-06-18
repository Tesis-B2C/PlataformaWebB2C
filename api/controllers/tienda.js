'use strict'

const moment = require('moment');
const TIENDA = require('../models/tienda'); //importar el modelo del usuario  o lo que son las clases comunesvar DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
const SUCURSAL = require('../models/sucursal');
const jwt = require('../services/jwt');
const db = require('../database/db');

const {QueryTypes} = require('sequelize');

async function registrarTienda(req, res) {
    try {

        let tiendaEncontrado = await TIENDA.findOne({where: {CORREO_TIENDA: req.body.Tienda.Correo_Tienda}});

        if (tiendaEncontrado) {
            res.status(404).send({
                message: 'Este correo electronico ya esta vinculado a una tienda'
            });
        } else {
            let json = JSON.stringify(req.body.Tienda);
            console.log("json", json);
            let tienda = await db.sequelize.query("call guardarTienda(:tienda)", {
                replacements: {
                    tienda: json,
                    type: QueryTypes.SELECT
                }
            });
            if (tienda.length) {
                res.status(200).send({
                    data: tienda,
                    message: "Su tienda ha sido creada"
                });
            } else {
                res.status(200).send({
                    message: "Su tienda no pudo ser registrada intente nuevamente más tarde"
                });
            }

        }
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

async function subirImagenesTienda(req, res) {

    try{
    let Id_Tienda = req.params.id;
    let tipo = req.params.tipo;
    let file_name = 'No se ha subido ninguna Imagen';
    let files =req.files.uploads[0];
    if (files) {
        let file_path = files['path'];
        let file_split = file_path.split('\\');
        let file_name = file_split[2];
        let ext_split = file_name.split('\.');
        let file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'png' || file_ext == 'JPG') {
            let tienda = await TIENDA.findOne({where: {ESTADO: '0', NUM_TIENDA: Id_Tienda}});
            if (tipo == "Logo") {
                var tiendaActualizada = await tienda.update({LOGO: file_name});
            } else if (tipo == "Banner") {
                var tiendaActualizada = await tienda.update({BANNER: file_name});
            }
            if (!tiendaActualizada) {
                res.status(404).send({message: 'No se ha podido guardar el ' + tipo});
            } else {
                res.status(200).send({message: tipo + 'guardado correctamente'});
            }


        } else {
            res.status(500).send({
                message: 'El formato de archivo no es valido '
            });
        }

    } else {
        res.status(200).send({
            message: 'No ha subido niguna imagen'
        });

    }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}
    async function getDatosTienda() {

    }

    module.exports = {          // para exportar todas las funciones de este modulo
        registrarTienda,
        subirImagenesTienda,
        getDatosTienda

    };
