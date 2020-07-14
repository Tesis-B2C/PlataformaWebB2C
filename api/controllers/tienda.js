'use strict'


const HORARIO_ATENCION = require('../models/horario_atencion');
const moment = require('moment');
const TIENDA = require('../models/tienda'); //importar el modelo del usuario  o lo que son las clases comunesvar DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
const SUCURSAL = require('../models/sucursal');
const jwt = require('../services/jwt');
const db = require('../database/db');
const fs = require('fs-extra');
const path = require('path');
const OFERTA = require("../models/oferta");
const {Op} = require("sequelize");

/*const {QueryTypes} = require('sequelize');*/

async function registrarTienda(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});

    try {
        let params = JSON.parse(req.body.tienda);
        console.log("body asd", params.Sucursal);
        if (req.files.logo) {
            var logo = req.files.logo[0].path;
        }
        if (req.files.banner) {
            var banner = req.files.banner[0].path;
        }

        let tiendaEncontrado = await TIENDA.findOne({where: {CORREO_TIENDA: params.Tienda.Correo_Tienda}});

        if (tiendaEncontrado) {
            res.status(404).send({
                message: 'Este correo electronico ya esta vinculado a una tienda'
            });
        } else {

            let tiendaGuardado = await TIENDA.create({
                    COD_AGENTE: params.Tienda.Cod_Agente,
                    RAZON_SOCIAL: params.Tienda.Razon_Social,
                    NOMBRE_COMERCIAL: params.Tienda.Nombre_Comercial,
                    LINK_PAGINA: params.Tienda.Link_Pagina,
                    LINK_FACEBOOK: params.Tienda.Link_Facebook,
                    DESCRIPCION_TIENDA: params.Tienda.Descripcion_Tienda,
                    ESTADO_TIENDA: params.Tienda.Estado_Tienda,
                    TERMINOS_CONDICIONES: params.Tienda.Terminos_Condiciones,
                    CORREO_TIENDA: params.Tienda.Correo_Tienda,
                    HORARIO_ATENCION: params.Tienda.Horario_Atencion,
                    LOGO: logo,
                    BANNER: banner
                },
                {
                    transaction: t
                });

            for (const s of params.Sucursal) {
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
                        TIPO_SUCURSAL: s.Tipo_Sucursal
                    },
                    {transaction: t});

            }

            if (tiendaGuardado) {
                res.status(200).send({
                    data: tiendaGuardado.dataValues,
                    message: "Su tienda ha sido creada exitosamente ya puedes comenzar a vender en COMDERO y disfrutar de todos sus beneficios"
                });

                await t.commit();
            } else {
                res.status(404).send({
                    message: "Al parecer hubo probelmas con la creacion de tu tienda intentalo nuevamente"
                });
            }
        }
    } catch (err) {
        if (fs.exists(path.resolve(req.files.logo[0].path))) {
            console.log('existe');
            await fs.unlink(path.resolve(req.files.logo[0].path));
        }
        if (fs.exists(path.resolve(req.files.banner[0].path))) {
            console.log('existe');
            await fs.unlink(path.resolve(req.files.banner[0].path));
        }
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


async function getDatosTienda(req, res) {

    try {
        let tiendaObtenida = await TIENDA.findOne({
            where: {NUM_TIENDA: req.params.id},
            include: [{model: SUCURSAL}, {model: HORARIO_ATENCION}]
        });

        if (tiendaObtenida) {
            res.status(200).send({
                data: tiendaObtenida,
                message: "Tienda cargada correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer la tienda no se encuentra registrada en la base de datos'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getMisTiendas(req, res) {

    try {
        let tiendasObtenidas = await TIENDA.findAll({where: {COD_AGENTE: req.params.id,ESTADO_TIENDA: {[Op.or]:[0,1]}}});

        if (tiendasObtenidas.length) {
            res.status(200).send({
                data: tiendasObtenidas,
                message: "Tiendas cargadas correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer  no se encuentra tiendas registradas en la base de datos'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function updateEstadoTienda(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let tiendaActualizada = await TIENDA.update({
            ESTADO_TIENDA: req.body.estado,
        }, {
            where: {NUM_TIENDA: req.params.id},
            transaction: t
        });

        let ofertaActualizada = await OFERTA.update({
            ESTADO_OFERTA: req.body.estado,
        }, {
            where: {NUM_TIENDA: req.params.id, ESTADO_OFERTA: {[Op.or]:[0,1]}},
            transaction: t
        });

        if (tiendaActualizada && ofertaActualizada) {
            res.status(200).send({
                message: "La tienda ha sido actualizada correctamente"
            });
            await t.commit();
        } else {
            res.status(404).send({
                message: 'Al parecer no se encuentra la tienda registrada en la base de datos'
            });
        }
    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


/*async function subirImagenesTienda(req, res) {

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
                        res.status(200).send({message: tipo + ' ha sido guardado correctamente, por favor espere unos momentos más, estamos a punto de terminar'});
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
}*/


/*
async function obtenerImagenTienda(req, res) {
    try {
        var imageFile = req.params.imageFile;

       var path_file = './uploads/tienda/' + imageFile;
        console.log("este es el path" + path_file);
        if (fs.existsSync(imageFile)) {
            res.sendFile(path.resolve(imageFile));
        } else {
            var path_file = './uploads/tienda/sinLogo.png';
            res.sendFile(path.resolve(path_file));
        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}
*/


module.exports = {          // para exportar todas las funciones de este modulo
    registrarTienda,
    getDatosTienda,
    getMisTiendas,
    updateEstadoTienda
    /* subirImagenesTienda,*/
    /*   obtenerImagenTienda*/

};


