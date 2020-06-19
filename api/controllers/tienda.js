'use strict'

const moment = require('moment');
const TIENDA = require('../models/tienda'); //importar el modelo del usuario  o lo que son las clases comunesvar DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
const SUCURSAL = require('../models/sucursal');
const jwt = require('../services/jwt');
const db = require('../database/db');

const {QueryTypes} = require('sequelize');

async function registrarTienda(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});

    try {

        let tiendaEncontrado = await TIENDA.findOne({where: {CORREO_TIENDA: req.body.Tienda.Correo_Tienda}});

        if (tiendaEncontrado) {
            res.status(404).send({
                message: 'Este correo electronico ya esta vinculado a una tienda'
            });
        } else {

            let tiendaGuardado = await TIENDA.create({
                    COD_AGENTE: req.body.Tienda.Cod_Agente,
                    RAZON_SOCIAL: req.body.Tienda.Razon_Social,
                    NOMBRE_COMERCIAL: req.body.Tienda.Nombre_Comercial,
                    LINK_PAGINA: req.body.Tienda.Link_Pagina,
                    LINK_FACEBOOK: req.body.Tienda.Link_Facebook,
                    DESCRIPCION_TIENDA: req.body.Tienda.Descripcion_Tienda,
                    LOGO: req.body.Tienda.Logo,
                    BANNER: req.body.Tienda.Banner,
                    ESTADO_TIENDA: req.body.Tienda.Estado_Tienda,
                    TERMINOS_CONDICIONES: req.body.Tienda.Terminos_Condiciones,
                    CORREO_TIENDA: req.body.Tienda.Correo_Tienda,
                    HORARIO_ATENCION: req.body.Tienda.Horario_Atencion
                },
                {
                    transaction: t
                });

            for (const s of req.body.Sucursal) {
                await SUCURSAL.create(
                    {
                        NUM_TIENDA: tiendaGuardado.dataValues.NUM_TIENDA,
                        COD_DPA: s.Ciudad,
                        DIRECCION_SUCURSAL: s.Direccion_Sucursal,
                        TELEFONO_SUCURSAL: s.Telefono_Sucursal,
                        RUC: s.Ruc,
                        LATITUD: s.Latitud,
                        LONGITUD: s.Longitud,
                        NUM_REFERENCIA: s.Num_Referencia,
                        NUM_COD_POSTAL_SUCURSAL: s.Num_Cod_Postal_Sucursal,
                        TIPO_SUCURSAL:s.Tipo_Sucursal
                    },
                    {transaction: t});

            }

            if (tiendaGuardado) {
                res.status(200).send({
                    data: tiendaGuardado.dataValues,
                    message: "Su tienda ha sido creada"
                });

                await t.commit();
            } else {
                res.status(404).send({
                    message: "Al parecer hubo probelmas con la creacion de tu tienda intentalo nuevamente"
                });
            }
        }
    } catch (err) {
        await t.rollback();
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

    try {
        let Id_Tienda = req.params.id;
        let tipo = req.params.tipo;
        let file_name = 'No se ha subido ninguna Imagen';
        let files = req.files.uploads[0];
        if (files) {
            let file_path = files['path'];
            let file_split = file_path.split('\\');
            let file_name = file_split[2];
            let ext_split = file_name.split('\.');
            let file_ext = ext_split[1];
            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'png' || file_ext == 'JPG') {
                let tiendaEncontrada = await TIENDA.findOne({where: {ESTADO_TIENDA: '1', NUM_TIENDA: Id_Tienda}});
                if (tiendaEncontrada) {
                    if (tipo == "Logo") {
                        var tiendaActualizada = await tiendaEncontrada.update({LOGO: file_name});
                    } else if (tipo == "Banner") {
                        var tiendaActualizada = await tiendaEncontrada.update({BANNER: file_name});
                    }
                    if (!tiendaActualizada) {
                        res.status(404).send({message: 'No se ha podido guardar el ' + tipo});
                    } else {
                        res.status(200).send({message: tipo + 'guardado correctamente'});
                    }
                } else {
                    res.status(404).send({message: 'Al parecer existe un problema con tu tienda, pudes comunicarte con nostros'});
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
