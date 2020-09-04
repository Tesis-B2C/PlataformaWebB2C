'use strict'

const Carrito = require('../models/carrito'); //importar el modelo del usuario  o lo que son las clases comunes
const Carrito_Producto = require('../models/carrito_producto'); //importar el modelo del usuario  o lo que son las clases comunes
const Agente = require("../models/Agente");
const Producto = require("../models/producto");
const Variante = require("../models/variante");
const Imagen_Producto = require("../models/imagen_producto");
const Producto_Descuento = require("../models/producto_descuento");
const Oferta = require("../models/oferta");
const Descuento = require("../models/descuento");
const Tienda = require("../models/tienda");
const {Op} = require("sequelize");
const moment = require('moment');

async function getCarrito(req, res) {

    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            let carritoObtenido = await Carrito.findOne({
                where: {COD_AGENTE: req.user.id},
                include: {
                    model: Carrito_Producto,
                    separate: true,
                    order: [['FECHA_CREACION_CARRITO', 'DESC']],
                    include: {
                        model: Variante,

                        include: [{
                            model: Producto,
                            include: [{model: Oferta, include: {model: Tienda}}, {
                                model: Producto_Descuento,
                                include: {model: Descuento}
                            }]
                        }]
                    }
                }
            });

            if (carritoObtenido) {
                res.status(200).send({
                    data: carritoObtenido,
                    message: "Carrito de compras cargado correctamente"
                });
            } else {
                let crearCarrito = await Carrito.create({COD_AGENTE: req.user.id, CANTIDAD_TOTAL_PRODUCTOS: 0});

                res.status(200).send({
                    data: carritoObtenido,
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
    console.log(" cod agente ", req.body);
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}, include: {model: Carrito}});
    try {
        if (!verificar) {
            return res.status(500).send({
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
                res.status(404).send({
                    message: 'Este producto ya se encuentra en el carrito de compras'
                });
            } else {
                let carritoGuardado = await Carrito_Producto.create({
                    NUM_VARIANTE: req.body.Num_Variante,
                    ID_CARRITO: verificar.dataValues.CARRITO.ID_CARRITO,
                    CANTIDAD_PRODUCTO_CARRITO: req.body.Cantidad_Producto_Carrito,
                    FECHA_CREACION_CARRITO: moment(),
                    IMAGEN_MOSTRAR: req.body.Imagen_Mostrar
                });
                let cont = await Carrito_Producto.findOne({
                    where: {
                        ID_CARRITO: verificar.dataValues.CARRITO.ID_CARRITO,
                    },
                    attributes: ['ID_CARRITO', [Carrito_Producto.sequelize.fn('COUNT', Carrito_Producto.sequelize.col('ID_CARRITO')), 'TOTAL_COM']],
                });
                console.log("conmt", cont.dataValues.TOTAL_COM);

                let carritoActualizado = await Carrito.update({CANTIDAD_TOTAL_PRODUCTOS: cont.dataValues.TOTAL_COM}, {
                    where: {COD_AGENTE: req.user.id}
                });

                if (carritoGuardado) {
                    res.status(200).send({
                        data: carritoGuardado,
                        message: "Carrito de compras actualizado correctamente"
                    });
                } else {
                    res.status(404).send({
                        message: 'No se pudo agregar producto al carrito de comrpas'
                    });


                }
            }
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function updateCantidadProducto(req, res) {
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let verificarCantidad = await Variante.findOne({where: {NUM_VARIANTE: req.params.num_variante}});
            console.log("asd", req.params.num_variante, "cantidad", req.body.cantidad)
            if (verificarCantidad.dataValues.STOCK >= req.body.cantidad) {
                let cantidadActualizada = await Carrito_Producto.update({
                    CANTIDAD_PRODUCTO_CARRITO: req.body.cantidad,
                }, {
                    where: {NUM_VARIANTE: req.params.num_variante, ID_CARRITO: req.body.id_carrito},
                });
                if (cantidadActualizada) {
                    res.status(200).send({
                        message: "Se actualizó la cantidad correctamente",
                        data: req.body.cantidad

                    });
                } else {
                    res.status(404).send({
                        message: 'Al parecer no se actualizó la cantidad del producto',
                        data: 1

                    });
                }
            } else {

                let cantidadActualizada = await Carrito_Producto.update({
                    CANTIDAD_PRODUCTO_CARRITO: verificarCantidad.dataValues.STOCK,
                }, {
                    where: {NUM_VARIANTE: req.params.num_variante, ID_CARRITO: req.body.id_carrito},
                });


                res.status(404).send({
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
            return res.status(500).send({
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
                    console.log("conmt", cont.dataValues.TOTAL_COM);

                    let carritoActualizado = await Carrito.update({CANTIDAD_TOTAL_PRODUCTOS: cont.dataValues.TOTAL_COM}, {
                        where: {COD_AGENTE: req.user.id}
                    });
                    res.status(200).send({
                        message: "Se quito el producto de tu carrito de compras",

                    });
                }
            }
        }
    } catch (err) {
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
