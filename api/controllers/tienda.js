'use strict'

const moment = require('moment');
const TIENDA = require('../models/tienda'); //importar el modelo del usuario  o lo que son las clases comunesvar DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
const SUCURSAL = require('../models/sucursal');
const HORARIO_ATENCION = require('../models/horario_atencion');
const OPCION_ENVIO = require('../models/opcion_envio');
const DPA = require('../models/dpa');
const METODO_PAGO = require('../models/metodo_pago');
const jwt = require('../services/jwt');
const db = require('../database/db');
const fs = require('fs-extra');
const path = require('path');
const OFERTA = require("../models/oferta");
const PRODUCTO = require("../models/producto");
const VARIANTE = require("../models/variante");
const IMAGEN_PRODUCTO = require("../models/imagen_producto");
const PRODUCTO_CATEGORIA = require("../models/producto_categoria");
const CATEGORIA = require("../models/categoria");
const CALIFICACION = require("../models/calificacion");
const COMENTARIO = require("../models/comentario");
const {Op} = require("sequelize");

/*const {QueryTypes} = require('sequelize');*/

async function registrarTienda(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});

    try {
        let params = JSON.parse(req.body.tienda);
        console.log("body asd", params);
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
                    BANNER: banner,
                    CONTACTO_WHATSAPP: params.Tienda.Contacto_WhatsApp
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
                    message: "Al parecer hubo problemas con la creación de tu tienda inténtalo nuevamente"
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
            include: [{
                model: SUCURSAL,
                include: {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}
            }, {model: HORARIO_ATENCION}, {model: METODO_PAGO}, {model: OPCION_ENVIO}],
            order: [[SUCURSAL, 'NUM_SUCURSAL', 'ASC']]
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
        let tiendasObtenidas = await TIENDA.findAll({
            where: {
                COD_AGENTE: req.params.id,
                ESTADO_TIENDA: {[Op.or]: [0, 1]}
            }
        });

        if (tiendasObtenidas.length > 0) {
            res.status(200).send({
                data: tiendasObtenidas,
                message: "Tiendas cargadas correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer no se encuentran tiendas registradas en la base de datos'
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
            where: {NUM_TIENDA: req.params.id, ESTADO_OFERTA: {[Op.or]: [0, 1]}},
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


async function updatePersonalizacionTienda(req, res) {
    console.log("files ", req.files)
    try {
        let tiendaObtenida = await TIENDA.findOne({
            where: {NUM_TIENDA: req.params.id}
        });

        if (req.files.logo) {
            var logo = req.files.logo[0].path;
        }
        if (req.files.banner) {
            var banner = req.files.banner[0].path;
        }

        let tiendaGuardado = await TIENDA.update({
            LOGO: logo,
            BANNER: banner
        }, {
            where: {NUM_TIENDA: req.params.id}
        });


        if (tiendaGuardado) {
            if (tiendaObtenida.dataValues.LOGO && req.files.logo) {
                if (fs.exists(path.resolve(tiendaObtenida.dataValues.LOGO))) {
                    console.log('existe');
                    await fs.unlink(path.resolve(tiendaObtenida.dataValues.LOGO));
                }
            }
            if (tiendaObtenida.dataValues.BANNER && req.files.banner) {
                if (fs.exists(path.resolve(tiendaObtenida.dataValues.BANNER))) {
                    console.log('existe');
                    await fs.unlink(path.resolve(tiendaObtenida.dataValues.BANNER));
                }
            }
            res.status(200).send({
                data: tiendaGuardado.dataValues,
                message: "Su tienda ha sido actualizada correctamente"
            });


        } else {
            res.status(404).send({
                message: "Al parecer hubo problemas con la actualización de su tienda inténtalo nuevamente"
            });
        }

    } catch
        (err) {
        /*if (fs.exists(path.resolve(req.files.logo[0].path))) {
              console.log('existe');
              await fs.unlink(path.resolve(req.files.logo[0].path));
          }
          if (fs.exists(path.resolve(req.files.banner[0].path))) {
              console.log('existe');
              await fs.unlink(path.resolve(req.files.banner[0].path));
          }*/
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

async function actualizarTiendaGeneral(req, res) {
    const trans = await db.sequelize.transaction({autocommit: false});
    try {
        let params = req.body;
        let tiendaId = req.params.id;

        let tiendaActualizado = await TIENDA.update({
            RAZON_SOCIAL: params.EditarTienda.Razon_Social,
            NOMBRE_COMERCIAL: params.EditarTienda.Nombre_Comercial,
            DESCRIPCION_TIENDA: params.EditarTienda.Descripcion_Tienda,
            CORREO_TIENDA: params.EditarTienda.Correo_Tienda,
            LINK_PAGINA: params.EditarTienda.Link_Pagina,
            LINK_FACEBOOK: params.EditarTienda.Link_Facebook,
            TERMINOS_CONDICIONES: params.EditarTienda.Terminos_Condiciones,
            HORARIO_ATENCION: params.EditarTienda.Horario_Atencion,
            CONTACTO_WHATSAPP: params.EditarTienda.Contacto_WhatsApp,
        }, {
            where: {NUM_TIENDA: tiendaId},
            transaction: trans
        });

        let horariosObtenidos = await HORARIO_ATENCION.findAll({where: {NUM_TIENDA: tiendaId}});

        if (horariosObtenidos.length > 0) {
            await HORARIO_ATENCION.destroy({
                where: {NUM_TIENDA: tiendaId},
                transaction: trans
            });
        }

        if (params.EditarTienda.Horario_Atencion == 'Concreto') {
            for (const h of params.Editar_Dias_Atencion) {
                if (h.Dia != null) {
                    await HORARIO_ATENCION.create(
                        {
                            NUM_TIENDA: tiendaId,
                            DIA: h.Dia,
                            INICIO_JORNADA1: h.Inicio_Jornada1,
                            FIN_JORNADA1: h.Fin_Jornada1,
                            INICIO_JORNADA2: h.Inicio_Jornada2,
                            FIN_JORNADA2: h.Fin_Jornada2
                        },
                        {transaction: trans});
                }
            }
        }
        if (tiendaActualizado) {
            res.status(200).send({message: 'Los datos generales de la tienda han sido actualizados'});
            await trans.commit();
        } else {
            res.status(404).send({message: 'Los datos generales de la tienda no han sido actualizados'});
        }
    } catch (e) {
        await trans.rollback();
        res.status(500).send({
            message: err.name
        });
    }
}

async function actualizarTiendaSucursal(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let params = req.body;
        let tiendaId = req.params.id;

        let sucursalesObtenidos = await SUCURSAL.findAll({where: {NUM_TIENDA: tiendaId}});

        if (sucursalesObtenidos.length > 0) {
            await SUCURSAL.destroy({
                where: {NUM_TIENDA: tiendaId},
                transaction: t
            });
        }

        for (const s of params) {
            await SUCURSAL.create(
                {
                    NUM_TIENDA: tiendaId,
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
        res.status(200).send({message: 'Sus datos han sido actualizados'});
        await t.commit();
    } catch (e) {
        await t.rollback();
        res.status(500).send({
            message: err.name
        });
    }
}

async function getDetalleTiendaProducto(req, res) {
    try {
        let tiendaObtenida = await TIENDA.findOne({
            where: {NUM_TIENDA: req.params.id},
            include: [{model: OPCION_ENVIO}, {model: METODO_PAGO}, {model: HORARIO_ATENCION}, {
                model: SUCURSAL,
                include: {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}
            }, {
                model: OFERTA, include: [{
                    model: PRODUCTO,
                    attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', 'NOMBRE_PRODUCTO'],
                    include: [{
                        model: PRODUCTO_CATEGORIA,
                        include: {model: CATEGORIA}
                    }, {
                        model: VARIANTE,
                        separate: true,
                        attributes: ['PRECIO_UNITARIO'],
                        group: ['ID_PRODUCTO', 'COD_PRODUCTO'],
                        order: [['NUM_VARIANTE', 'ASC']],
                        include: {
                            model: IMAGEN_PRODUCTO,
                            separate: true,
                            attributes: ['IMAGEN'],
                            group: 'NUM_VARIANTE',
                            order: [['ID_IMAGEN', 'ASC']]
                        }
                    },
                        {
                            model: CALIFICACION,
                            separate: true,
                            attributes: ['ID_PRODUCTO', [CALIFICACION.sequelize.fn('AVG', CALIFICACION.sequelize.col('NUM_ESTRELLAS')), 'PROMEDIO_CAL']],
                            group: ['ID_PRODUCTO']
                        }, {
                            model: COMENTARIO,
                            separate: true,
                            attributes: ['ID_PRODUCTO', [COMENTARIO.sequelize.fn('COUNT', COMENTARIO.sequelize.col('ID_COMENTARIO')), 'TOTAL_COM']],
                            group: ['ID_PRODUCTO']
                        }]
                }],
                order: [[SUCURSAL, 'NUM_SUCURSAL', 'ASC']]
            }]
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

async function obtenerFiltroPrincipalTienda(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let termino = req.params.termino;
        let tiendasObtenidos = await TIENDA.findAll({
            attributes: ['NOMBRE_COMERCIAL'],
            where: {
                [Op.or]: [
                    {NOMBRE_COMERCIAL: {[Op.like]: termino + '%'}},
                    {NOMBRE_COMERCIAL: {[Op.like]: '%' + termino}},
                    {NOMBRE_COMERCIAL: {[Op.like]: '%' + termino + '%'}}
                ]
            },
            limit: 10,
            transaction: t
        });

        await t.commit();
        res.status(200).send({
            data: tiendasObtenidos,
            message: "Tiendas obtenidas correctamente"
        });
    } catch (e) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function obtenerFiltroPrincipalProductos(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let termino = req.params.termino;
        let productosObtenidos = await PRODUCTO.findAll({
            attributes: ['NOMBRE_PRODUCTO'],
            where: {
                [Op.or]: [
                    {NOMBRE_PRODUCTO: {[Op.like]: termino + '%'}},
                    {NOMBRE_PRODUCTO: {[Op.like]: '%' + termino}},
                    {NOMBRE_PRODUCTO: {[Op.like]: '%' + termino + '%'}}
                ]
            },
            limit: 10,
            transaction: t
        });

        await t.commit();
        res.status(200).send({
            data: productosObtenidos,
            message: "Productos cargados correctamente"
        });
    } catch (e) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function obtenerFiltroPrincipalTodos(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let vectorEnviar = [];
        let termino = req.params.termino;
        let tiendasObtenidos = await TIENDA.findAll({
            attributes: ['NOMBRE_COMERCIAL'],
            where: {
                [Op.or]: [
                    {NOMBRE_COMERCIAL: {[Op.like]: termino + '%'}},
                    {NOMBRE_COMERCIAL: {[Op.like]: '%' + termino}},
                    {NOMBRE_COMERCIAL: {[Op.like]: '%' + termino + '%'}}
                ]
            },
            limit: 8,
            transaction: t
        });

        let productosObtenidos = await PRODUCTO.findAll({
            attributes: ['NOMBRE_PRODUCTO'],
            where: {
                [Op.or]: [
                    {NOMBRE_PRODUCTO: {[Op.like]: termino + '%'}},
                    {NOMBRE_PRODUCTO: {[Op.like]: '%' + termino}},
                    {NOMBRE_PRODUCTO: {[Op.like]: '%' + termino + '%'}}
                ]
            },
            limit: 8,
            transaction: t
        });

        vectorEnviar.push(tiendasObtenidos);
        vectorEnviar.push(productosObtenidos);

        await t.commit();
        res.status(200).send({
            data: vectorEnviar,
            message: "Busqueda cargada correctamente"
        });

    } catch (e) {
        await t.rollback();
    }
}

async function obtenerFiltroBusquedaTodos(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let vectorEnviar = [];
        let termino = req.params.termino;

        let productosObtenidos = await OFERTA.findAll({
            include: [{
                model: PRODUCTO,
                attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', 'ID_OFERTA', 'NOMBRE_PRODUCTO', 'DESCRIPCION_PRODUCTO'],
                where: {
                    [Op.or]: [
                        {NOMBRE_PRODUCTO: {[Op.like]: termino + '%'}},
                        {NOMBRE_PRODUCTO: {[Op.like]: '%' + termino}},
                        {NOMBRE_PRODUCTO: {[Op.like]: '%' + termino + '%'}}
                    ]
                },
                include: [{
                    model: VARIANTE,
                    separate: true,
                    attributes: ['ID_PRODUCTO', 'NUM_VARIANTE', 'PRECIO_UNITARIO'],
                    group: ['ID_PRODUCTO', 'COD_PRODUCTO'],
                    order: [['NUM_VARIANTE', 'ASC']],
                    include: {
                        model: IMAGEN_PRODUCTO,
                        separate: true,
                        attributes: ['NUM_VARIANTE', 'IMAGEN'],
                        group: 'NUM_VARIANTE',
                        where:{
                            [Op.or]: [
                                {[Op.not]: {TIPO_IMAGEN: 'video'}},
                                {[Op.not]: {TIPO_IMAGEN: 'youtube'}}
                            ]
                        },
                        order: [['ID_IMAGEN', 'ASC']]
                    }
                }, {
                    model: CALIFICACION,
                    separate: true,
                    attributes: ['ID_PRODUCTO', [CALIFICACION.sequelize.fn('AVG', CALIFICACION.sequelize.col('NUM_ESTRELLAS')), 'PROMEDIO_CAL']],
                    group: ['ID_PRODUCTO']
                }, {
                    model: COMENTARIO,
                    separate: true,
                    attributes: ['ID_PRODUCTO', [COMENTARIO.sequelize.fn('COUNT', COMENTARIO.sequelize.col('ID_COMENTARIO')), 'TOTAL_COM']],
                    group: ['ID_PRODUCTO']
                }]
            }, {
                model: TIENDA,
                attributes: ['NUM_TIENDA', 'NOMBRE_COMERCIAL']
            }],
            attributes: ['ID_OFERTA'],
            transaction: t
        });

        let tiendasObtenidos = await TIENDA.findAll({
            attributes: ['NUM_TIENDA', 'NOMBRE_COMERCIAL', 'LOGO'],
            where: {
                [Op.or]: [
                    {NOMBRE_COMERCIAL: {[Op.like]: termino + '%'}},
                    {NOMBRE_COMERCIAL: {[Op.like]: '%' + termino}},
                    {NOMBRE_COMERCIAL: {[Op.like]: '%' + termino + '%'}}
                ]
            },
            limit: 5,
            transaction: t
        });

        vectorEnviar.push(tiendasObtenidos);
        vectorEnviar.push(productosObtenidos);

        await t.commit();
        res.status(200).send({
            data: vectorEnviar,
            message: "Tiendas y productos cargados correctamente"
        });
    } catch (e) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function obtenerTodasTiendas(req, res) {
    try {
        let tiendasObtenidas = await TIENDA.findAll();
        if (tiendasObtenidas.length > 0) {
            res.status(200).send({
                data: tiendasObtenidas,
                message: "Tiendas cargadas correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer no se encuentran tiendas registradas en la base de datos'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo
    registrarTienda,
    getDatosTienda,
    getMisTiendas,
    actualizarTiendaGeneral,
    actualizarTiendaSucursal,
    updateEstadoTienda,
    updatePersonalizacionTienda,
    obtenerFiltroPrincipalTienda,
    obtenerFiltroPrincipalProductos,
    obtenerFiltroPrincipalTodos,
    getDetalleTiendaProducto,
    obtenerTodasTiendas,
    obtenerFiltroBusquedaTodos
    /* subirImagenesTienda,*/
    /*   obtenerImagenTienda*/
};

