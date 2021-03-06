'use strict'


const Carrito = require('../models/carrito'); //importar el modelo del usuario  o lo que son las clases comunes
const Carrito_Producto = require('../models/carrito_producto'); //importar el modelo del usuario  o lo que son las clases comunes
const Agente = require("../models/agente");
const Producto = require("../models/producto");
const Variante = require("../models/variante");
const Imagen_Producto = require("../models/imagen_producto");
const Producto_Descuento = require("../models/producto_descuento");
const Oferta = require("../models/oferta");
const Descuento = require("../models/descuento");
const Tienda = require("../models/tienda");
const {Op} = require("sequelize");
const moment = require('moment');
const Opcion_Envio = require('../models/opcion_envio');
const DPA = require('../models/dpa');
const Metodo_Pago = require('../models/metodo_pago');
const Sucursal = require('../models/sucursal');
const db = require('../database/db');

async function getCarrito(req, res) {

    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            let carritoObtenido = await Carrito.findOne({
                where: {COD_AGENTE: req.user.id,},
                include: [{
                    model: Carrito_Producto,
                    separate: true,
                    order: [['FECHA_CREACION_CARRITO', 'DESC']],
                    include: {
                        model: Variante,
                        include: [{
                            model: Producto,
                            include: [{
                                model: Oferta,
                                include: {
                                    model: Tienda,
                                    include: [{model: Metodo_Pago}, {model: Opcion_Envio}, {
                                        model: Sucursal,
                                        include: {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}
                                    }]
                                }
                            }, {
                                model: Producto_Descuento,
                                include: {model: Descuento}
                            }]
                        }]
                    }
                }]
            });

            if (carritoObtenido) {
                res.status(200).send({
                    data: carritoObtenido,
                    message: "Carrito de compras cargado correctamente"
                });
            } else {
                let crearCarrito = await Carrito.create({COD_AGENTE: req.user.id, CANTIDAD_TOTAL_PRODUCTOS: 0});

                res.status(200).send({
                    data: crearCarrito,
                    message: "Carrito de compras cargado correctamente"
                });


            }
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function saveCarrito(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}, include: {model: Carrito}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let busquedaCarrito = await Carrito_Producto.findOne({
                where: {
                    NUM_VARIANTE: req.body.Num_Variante,
                    ID_CARRITO: verificar.dataValues.CARRITO.ID_CARRITO
                }
            });
            if (busquedaCarrito) {
                res.status(400).send({
                    message: 'Este producto ya se encuentra en el carrito de compras'
                });
            } else {
                let carritoGuardado = await Carrito_Producto.create({
                    NUM_VARIANTE: req.body.Num_Variante,
                    ID_CARRITO: verificar.dataValues.CARRITO.ID_CARRITO,
                    CANTIDAD_PRODUCTO_CARRITO: req.body.Cantidad_Producto_Carrito,
                    FECHA_CREACION_CARRITO: moment(),
                    IMAGEN_MOSTRAR: req.body.Imagen_Mostrar
                }, {
                    transaction: t
                });
                let cont = await Carrito_Producto.findOne({
                    where: {
                        ID_CARRITO: verificar.dataValues.CARRITO.ID_CARRITO,
                    }, transaction: t,
                    attributes: ['ID_CARRITO', [Carrito_Producto.sequelize.fn('COUNT', Carrito_Producto.sequelize.col('ID_CARRITO')), 'TOTAL_COM']],
                });
                // console.log("conmt", cont.dataValues.TOTAL_COM);

                let carritoActualizado = await Carrito.update({CANTIDAD_TOTAL_PRODUCTOS: cont.dataValues.TOTAL_COM}, {
                    where: {COD_AGENTE: req.user.id}, transaction: t,
                });

                res.status(200).send({
                    data: carritoGuardado,
                    message: "Carrito de compras actualizado correctamente"
                });
                await t.commit();


            }
        }
    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function updateCantidadProducto(req, res) {
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let verificarCantidad = await Variante.findOne({where: {NUM_VARIANTE: req.params.num_variante}});
            if (verificarCantidad.dataValues.STOCK >= req.body.cantidad) {
                let cantidadActualizada = await Carrito_Producto.update({
                    CANTIDAD_PRODUCTO_CARRITO: req.body.cantidad,
                }, {
                    where: {NUM_VARIANTE: req.params.num_variante, ID_CARRITO: req.body.id_carrito},
                });
                
                    res.status(200).send({
                        message: "Se actualizó la cantidad correctamente",
                        data: req.body.cantidad

                    });
                
            } else {
                await Carrito_Producto.update({
                    CANTIDAD_PRODUCTO_CARRITO: verificarCantidad.dataValues.STOCK,
                }, {
                    where: {NUM_VARIANTE: req.params.num_variante, ID_CARRITO: req.body.id_carrito},
                });

                res.status(200).send({
                    message: 'Estock no disponible',
                    data: verificarCantidad.dataValues.STOCK

                });
            }

        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function deleteProductoCarrito(req, res) {
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let carritoEncontrado = await Carrito.findOne({where: {COD_AGENTE: req.user.id}});
            if (carritoEncontrado) {
                let productoBorrado = await Carrito_Producto.destroy({
                    where: {
                        ID_CARRITO: carritoEncontrado.dataValues.ID_CARRITO,
                        NUM_VARIANTE: req.params.num_variante
                    }
                });
                if (productoBorrado) {
                    let cont = await Carrito_Producto.findOne({
                        where: {
                            ID_CARRITO: carritoEncontrado.dataValues.ID_CARRITO,
                        },
                        attributes: ['ID_CARRITO', [Carrito_Producto.sequelize.fn('COUNT', Carrito_Producto.sequelize.col('ID_CARRITO')), 'TOTAL_COM']],
                    });
                    // console.log("conmt", cont.dataValues.TOTAL_COM);

                    let carritoActualizado = await Carrito.update({CANTIDAD_TOTAL_PRODUCTOS: cont.dataValues.TOTAL_COM}, {
                        where: {COD_AGENTE: req.user.id}
                    });
                    res.status(200).send({
                        message: "Se quito el producto de tu carrito de compras",

                    });
                } else {
                    res.status(402).send({
                        message: "No se quito el producto de tu carrito de compras",

                    });
                }
            }
        }
    } catch(err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


module.exports = {
    getCarrito,
    saveCarrito,
    updateCantidadProducto,
    deleteProductoCarrito

};
