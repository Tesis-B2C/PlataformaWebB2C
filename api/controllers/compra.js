'use strict'


const DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
const Compra = require('../models/compra');
const Compra_Producto = require('../models/compra_producto');
const Carrito = require('../models/carrito');
const Carrito_Producto = require('../models/carrito_producto');
const db = require('../database/db');
const Agente = require('../models/agente');
const Variante = require('../models/variante');
const Producto = require('../models/producto');
const Oferta = require('../models/oferta');
const Tienda = require('../models/tienda');
const moment = require('moment');

async function saveComprarProducto(req, res) {
    console.log(" INFORMACION COMPRA ", req.body);
    const t = await db.sequelize.transaction({autocommit: false});
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let compraGuardada;
            if (req.body.METODO_ENVIO_COMPRA == 'Domicilio') {
                compraGuardada = await Compra.create({
                    COD_AGENTE: req.body.COD_AGENTE,
                    FECHA_COMPRA: moment(),
                    HORA_COMPRA: moment().format('HH:mm:ss'),
                    CALLE_PRINCIPAL_ENTREGA: req.body.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA,
                    CALLE_SECUNDARIA_ENTREGA: req.body.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA,
                    COD_DPA: req.body.DATOS_ENTREGA.COD_DPA_ENTREGA,
                    NOMBRE_PERSONA_ENTREGA: req.body.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA.toUpperCase(),
                    TIPO_IDENTIFICACION_ENTREGA: req.body.DATOS_ENTREGA.TIPO_IDENTIFICACION_ENTREGA,
                    IDENTIFICACION_ENTREGA: req.body.DATOS_ENTREGA.IDENTIFICACION_ENTREGA,
                    NUM_COD_POSTAL_ENTREGA: req.body.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA,
                    TELEFONO_ENTREGA: req.body.DATOS_ENTREGA.TELEFONO_ENTREGA,
                    NUM_CASA_ENTREGA: req.body.DATOS_ENTREGA.NUM_CASA_ENTREGA,
                    TIPO_IDENTIFICACION_FACTURA: req.body.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA,
                    NOMBRE_FACTURA: req.body.DATOS_FACTURA.NOMBRE_FACTURA.toUpperCase(),
                    CORREO_FACTURA: req.body.DATOS_FACTURA.CORREO.toLowerCase(),
                    IDENTIFICACION_FACTURA: req.body.DATOS_FACTURA.IDENTIFICACION_FACTURA,
                    TELEFONO_FACTURA: req.body.DATOS_FACTURA.TELEFONO_FACTURA,
                    DIRECCION_FACTURA: req.body.DATOS_FACTURA.DIRECCION_FACTURA,
                    ESTADO_COMPRA: 0,
                    FECHA_ENVIO: null,
                    METODO_PAGO: req.body.METODO_PAGO_COMPRA,
                    METODO_ENVIO: req.body.METODO_ENVIO_COMPRA,
                    COSTO_ENVIO: req.body.COSTOS.COSTOS_ENVIO,
                    RECARGO_PAYPAL: req.body.COSTOS.RECARGO_PAYPAL,
                    PORCENTAJE_RECARGO_PAYPAL: req.body.COSTOS.PORCENTAJE_RECARGO_PAYPAL,

                }, {
                    transaction: t
                });
            } else {
                compraGuardada = await Compra.create({
                    COD_AGENTE: req.body.COD_AGENTE,
                    FECHA_COMPRA: moment(),
                    HORA_COMPRA: moment().format('HH:mm:ss'),
                    TIPO_IDENTIFICACION_FACTURA: req.body.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA,
                    NOMBRE_FACTURA: req.body.DATOS_FACTURA.NOMBRE_FACTURA.toUpperCase(),
                    CORREO_FACTURA: req.body.DATOS_FACTURA.CORREO.toLowerCase(),
                    IDENTIFICACION_FACTURA: req.body.DATOS_FACTURA.IDENTIFICACION_FACTURA,
                    TELEFONO_FACTURA: req.body.DATOS_FACTURA.TELEFONO_FACTURA,
                    DIRECCION_FACTURA: req.body.DATOS_FACTURA.DIRECCION_FACTURA,
                    ESTADO_COMPRA: 0,
                    FECHA_ENVIO: null,
                    METODO_PAGO: req.body.METODO_PAGO_COMPRA,
                    METODO_ENVIO: req.body.METODO_ENVIO_COMPRA,
                    COSTO_ENVIO: req.body.COSTOS.COSTOS_ENVIO,
                    RECARGO_PAYPAL: req.body.COSTOS.RECARGO_PAYPAL,
                    PORCENTAJE_RECARGO_PAYPAL: req.body.COSTOS.PORCENTAJE_RECARGO_PAYPAL,

                }, {
                    transaction: t
                });
            }

            let compraProductoGuardada = await Compra_Producto.create({
                    NUM_VARIANTE: req.body.NUM_VARIANTE,
                    NUM_COMPRA: compraGuardada.dataValues.NUM_COMPRA,
                    CANTIDAD_PRODUCTO: req.body.CANTIDAD,
                    PRECIO_UNITARIO: req.body.COSTOS.PRECIO_UNITARIO_PRODUCTO,
                    TOTAL_PRODUCTOS: req.body.COSTOS.TOTAL_PRODUCTOS,
                    IMPUESTOS: req.body.COSTOS.IMPUESTOS,
                    PORCENTAJE_IMPUESTO: req.body.COSTOS.PORCENTAJE_IMPUESTO,
                    SUBTOTAL: req.body.COSTOS.SUBTOTAL,
                    DESCUENTOS: req.body.COSTOS.DESCUENTOS,
                    PORCENTAJE_AUTOMATICO: req.body.COSTOS.PORCENTAJE_AUTOMATICO,
                    CUPON: req.body.COSTOS.CUPON,
                    PORCENTAJE_CUPON: req.body.COSTOS.PORCENTAJE_CUPON,
                    IMAGEN_MOSTRAR: req.body.IMAGEN_MOSTRAR

                }, {
                    transaction: t
                }
            );

            let varianteEncontrada = await Variante.findOne({
                where: {NUM_VARIANTE: req.body.NUM_VARIANTE}
            }, {
                transaction: t
            });

            let stockReducido = varianteEncontrada.dataValues.STOCK - req.body.CANTIDAD;
            let varianteActualizada = await Variante.update({STOCK: stockReducido}, {
                where: {NUM_VARIANTE: req.body.NUM_VARIANTE}
            }, {
                transaction: t
            });

            if (compraGuardada && compraProductoGuardada && varianteActualizada) {
                if (req.body.METODO_PAGO_COMPRA == "Transferencia") {
                    res.status(200).send({
                        message: "La compra se ha realizado correctamente su código de compra es:   <strong>" + compraGuardada.dataValues.NUM_COMPRA + "</strong>"
                    });
                } else {
                    res.status(200).send({
                        message: "La compra se ha realizado correctamente"
                    });
                }
            } else {
                res.status(404).send({
                    message: 'No se pudo realizar la compra'
                });


            }
            await t.commit();
        }
    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function saveComprarProductoCarrito(req, res) {
    console.log(" INFORMACION COMPRA ", req.body);
    const t = await db.sequelize.transaction({autocommit: false});
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let compraGuardada;
            if (req.body.METODO_ENVIO_COMPRA == 'Domicilio') {
                compraGuardada = await Compra.create({
                    COD_AGENTE: req.body.COD_AGENTE,
                    FECHA_COMPRA: moment(),
                    HORA_COMPRA: moment().format('HH:mm:ss'),
                    CALLE_PRINCIPAL_ENTREGA: req.body.DATOS_ENTREGA.CALLE_PRINCIPAL_ENTREGA,
                    CALLE_SECUNDARIA_ENTREGA: req.body.DATOS_ENTREGA.CALLE_SECUNDARIA_ENTREGA,
                    COD_DPA: req.body.DATOS_ENTREGA.COD_DPA_ENTREGA,
                    NOMBRE_PERSONA_ENTREGA: req.body.DATOS_ENTREGA.NOMBRE_PERSONA_ENVIO_ENTREGA.toUpperCase(),
                    TIPO_IDENTIFICACION_ENTREGA: req.body.DATOS_ENTREGA.TIPO_IDENTIFICACION_ENTREGA,
                    IDENTIFICACION_ENTREGA: req.body.DATOS_ENTREGA.IDENTIFICACION_ENTREGA,
                    NUM_COD_POSTAL_ENTREGA: req.body.DATOS_ENTREGA.NUM_COD_POSTAL_ENTREGA,
                    TELEFONO_ENTREGA: req.body.DATOS_ENTREGA.TELEFONO_ENTREGA,
                    NUM_CASA_ENTREGA: req.body.DATOS_ENTREGA.NUM_CASA_ENTREGA,
                    TIPO_IDENTIFICACION_FACTURA: req.body.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA,
                    NOMBRE_FACTURA: req.body.DATOS_FACTURA.NOMBRE_FACTURA.toUpperCase(),
                    CORREO_FACTURA: req.body.DATOS_FACTURA.CORREO.toLowerCase(),
                    IDENTIFICACION_FACTURA: req.body.DATOS_FACTURA.IDENTIFICACION_FACTURA,
                    TELEFONO_FACTURA: req.body.DATOS_FACTURA.TELEFONO_FACTURA,
                    DIRECCION_FACTURA: req.body.DATOS_FACTURA.DIRECCION_FACTURA,
                    ESTADO_COMPRA: 0,
                    FECHA_ENVIO: null,
                    METODO_PAGO: req.body.METODO_PAGO_COMPRA,
                    METODO_ENVIO: req.body.METODO_ENVIO_COMPRA,
                    COSTO_ENVIO: req.body.COSTOS.COSTOS_ENVIO,
                    RECARGO_PAYPAL: req.body.COSTOS.RECARGO_PAYPAL,
                    PORCENTAJE_RECARGO_PAYPAL: req.body.COSTOS.PORCENTAJE_RECARGO_PAYPAL,

                }, {
                    transaction: t
                });
            } else {
                compraGuardada = await Compra.create({
                    COD_AGENTE: req.body.COD_AGENTE,
                    FECHA_COMPRA: moment(),
                    HORA_COMPRA: moment().format('HH:mm:ss'),
                    TIPO_IDENTIFICACION_FACTURA: req.body.DATOS_FACTURA.TIPO_IDENTIFICACION_FACTURA,
                    NOMBRE_FACTURA: req.body.DATOS_FACTURA.NOMBRE_FACTURA.toUpperCase(),
                    CORREO_FACTURA: req.body.DATOS_FACTURA.CORREO.toLowerCase(),
                    IDENTIFICACION_FACTURA: req.body.DATOS_FACTURA.IDENTIFICACION_FACTURA,
                    TELEFONO_FACTURA: req.body.DATOS_FACTURA.TELEFONO_FACTURA,
                    DIRECCION_FACTURA: req.body.DATOS_FACTURA.DIRECCION_FACTURA,
                    ESTADO_COMPRA: 0,
                    FECHA_ENVIO: null,
                    METODO_PAGO: req.body.METODO_PAGO_COMPRA,
                    METODO_ENVIO: req.body.METODO_ENVIO_COMPRA,
                    COSTO_ENVIO: req.body.COSTOS.COSTOS_ENVIO,
                    RECARGO_PAYPAL: req.body.COSTOS.RECARGO_PAYPAL,
                    PORCENTAJE_RECARGO_PAYPAL: req.body.COSTOS.PORCENTAJE_RECARGO_PAYPAL,

                }, {
                    transaction: t
                });
            }
            for (const element of req.body.NUM_VARIANTE) {
                await Compra_Producto.create({
                        NUM_VARIANTE: element.NUM_VARIANTE,
                        NUM_COMPRA: compraGuardada.dataValues.NUM_COMPRA,
                        CANTIDAD_PRODUCTO: element.CANTIDAD_PRODUCTO_CARRITO,
                        PRECIO_UNITARIO: element.precio_unitario,
                        TOTAL_PRODUCTOS: element.precio_productos_sin_iva,
                        IMPUESTOS: element.impuestos,
                        PORCENTAJE_IMPUESTO: element.porcentaje_impuestos,
                        SUBTOTAL: element.precio_productos,
                        DESCUENTOS: element.descuentos,
                        PORCENTAJE_AUTOMATICO: element.porcentaje_descuento,
                        CUPON: element.descuentos_cupon,
                        PORCENTAJE_CUPON: element.porcentaje_descuento_cupon,
                        IMAGEN_MOSTRAR: element.IMAGEN_MOSTRAR
                    }, {
                        transaction: t
                    }
                );

                let varianteEncontrada = await Variante.findOne({
                    where: {NUM_VARIANTE: element.NUM_VARIANTE}
                }, {
                    transaction: t
                });

                let stockReducido = varianteEncontrada.dataValues.STOCK - element.CANTIDAD_PRODUCTO_CARRITO;
                let varianteActualizada = await Variante.update({STOCK: stockReducido}, {
                    where: {NUM_VARIANTE: element.NUM_VARIANTE}
                }, {
                    transaction: t
                });


                let carritoEncontrado = await Carrito.findOne({where: {COD_AGENTE: req.user.id}});
                if (carritoEncontrado) {
                    let productoBorrado = await Carrito_Producto.destroy({
                        where: {
                            ID_CARRITO: carritoEncontrado.dataValues.ID_CARRITO,
                            NUM_VARIANTE: element.NUM_VARIANTE
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

                    }
                }


            }

            if (compraGuardada) {
                if (req.body.METODO_PAGO_COMPRA == "Transferencia") {
                    res.status(200).send({
                        message: "La compra se ha realizado correctamente su código de compra es:   <strong>" + compraGuardada.dataValues.NUM_COMPRA + "</strong>"
                    });
                } else {
                    res.status(200).send({
                        message: "La compra se ha realizado correctamente"
                    });
                }
            } else {
                res.status(404).send({
                    message: 'No se pudo realizar la compra'
                });


            }
            await t.commit();
        }
    } catch
        (err) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getMisCompras(req, res) {
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let comprasObtenidas = await Compra.findAll({
                    where: {COD_AGENTE: req.user.id}, order: [['NUM_COMPRA', 'DESC']],
                    include: [{
                        model: Compra_Producto, include: {
                            model: Variante,
                            include: {model: Producto, include: {model: Oferta, include: {model: Tienda}}}
                        }
                    }, {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}]


                }
                )
            ;

            if (comprasObtenidas.length > 0) {
                res.status(200).send({
                    data: comprasObtenidas,
                    message: "Compra obtenida correcctamente"
                });
            } else {
                res.status(404).send({
                    message: 'No existen compras'
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
    saveComprarProducto,
    saveComprarProductoCarrito,
    getMisCompras
};