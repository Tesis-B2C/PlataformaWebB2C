'use strict'


const Carrito = require('../models/carrito'); //importar el modelo del usuario  o lo que son las clases comunes
const Carrito_Producto = require('../models/carrito_producto'); //importar el modelo del usuario  o lo que son las clases comunes
const Agente = require("../models/Agente");
const Producto = require("../models/producto");
const Variante = require("../models/variante");
const Imagen_Producto = require("../models/imagen_producto");
const Producto_Descuento = require("../models/producto_descuento");
const Descuento = require("../models/descuento");

async function getCarrito(req, res) {
    let busqueda = req.params.id;
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            let carritoObtenido = await Carrito.findOne({
                where: {COD_AGENTE: busqueda},
                include: {
                    model: Carrito_Producto,
                    include: {
                        model: Producto,
                        include: [{model: Variante, include: {model: Imagen_Producto}}, {
                            model: Producto_Descuento,
                            include: {model: Descuento}
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
                let crearCarrito = await Carrito.create({COD_AGENTE: busqueda, CANTIDAD_TOTAL_PRODUCTOS: 0});
                let carritoObtenido = await Carrito.findOne({
                    where: {COD_AGENTE: busqueda},
                    include: {
                        model: Carrito_Producto,
                        include: {
                            model: Producto,
                            include: [{model: Variante, include: {model: Imagen_Producto}}, {
                                model: Producto_Descuento,
                                include: {model: Descuento}
                            }]
                        }
                    }
                });

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

    let verificar = await Agente.findOne({where: {COD_AGENTE: req.body.Id_Agente, include: {model: Carrito}}});
    try {
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let carritoGuardado = await Carrito_Producto.create({
                ID_PRODUCTO: req.body.Id_Producto,
                COD_PRODUCTO: req.body.Cod_Producto,
                ID_CARRITO: verificar.CARRITO.ID_CARRITO
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
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {
    getCarrito,
    saveCarrito
};
