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
const Notificacion = require('../models/notificacion');

const moment = require('moment');
const {Op} = require("sequelize");
const {io} = require('../appi.js');


const {vUsuarios} = require('../sockets/socket');



async function saveComprarProducto(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            let variante = await Variante.findOne({where: {NUM_VARIANTE: req.body.NUM_VARIANTE}});
            if (variante.dataValues.STOCK < req.body.CANTIDAD) {
                return res.status(402).send({
                    message: "El stock solicitado ya no esta disponible"
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
                        TIENDA: req.body.ID_TIENDA

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
                        TIENDA: req.body.ID_TIENDA

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
                        where: {NUM_VARIANTE: req.body.NUM_VARIANTE}, transaction: t
                    }
                );

                let stockReducido = varianteEncontrada.dataValues.STOCK - req.body.CANTIDAD;
                let varianteActualizada = await Variante.update({STOCK: stockReducido}, {
                    where: {NUM_VARIANTE: req.body.NUM_VARIANTE}, transaction: t
                });

                let tiendaReceptora = await Tienda.findOne({
                        where: {NUM_TIENDA: req.body.ID_TIENDA}, transaction: t
                    }
                );

                let notificacionCreada = await Notificacion.create({
                    AGENTE_EMISOR: req.user.id,
                    AGENTE_RECEPTOR: tiendaReceptora.dataValues.COD_AGENTE,
                    ENVIAR_A: 'Tienda',
                    ASUNTO: 'Nueva compra',
                    MENSAJE: "Tienes una nueva solicitud  de compra",
                    CODIGO_TIENDA: req.body.ID_TIENDA,
                    NOMBRE_TIENDA:tiendaReceptora.dataValues.NOMBRE_COMERCIAL,
                    CODIGO_COMPRA: compraGuardada.dataValues.NUM_COMPRA,
                    ESTADO_NOTIFICACION: 0,
                    FECHA_NOTIFICACION: moment(),
                    HORA_NOTIFICACION: moment().format('HH:mm:ss')
                }, {
                    transaction: t
                });

                let bandera = true;
                let agentes = vUsuarios;
                for (let agent of agentes) {
                    for (let tienda of agent.tiendas) {
                        if (tienda.NUM_TIENDA == req.body.ID_TIENDA && bandera == true) {
                            io.in(`room_${agent.cod_agente}`).emit("notificacion", {message: "hola"});
                            bandera = false;
                        }
                    }
                }


                res.status(200).send({
                    message: "La compra se ha realizado correctamente su código de compra es: <br>  <strong style='font-size: xx-large'>" + compraGuardada.dataValues.NUM_COMPRA + "</strong>",
                    data:notificacionCreada
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


async function saveComprarProductoCarrito(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
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
                    TIENDA: req.body.ID_TIENDA

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
                    TIENDA: req.body.ID_TIENDA
                }, {
                    transaction: t
                });
            }
            for (const element of req.body.NUM_VARIANTE) {

                let variante = await Variante.findOne({where: {NUM_VARIANTE: element.NUM_VARIANTE}});
                if (variante.dataValues.STOCK < element.CANTIDAD_PRODUCTO_CARRITO) {
                    t.rollback();
                    return res.status(400).send({
                        message: "El stock solicitado de algunos productos  ya no esta disponible"
                    });
                } else {

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
                        where: {NUM_VARIANTE: element.NUM_VARIANTE},
                        transaction: t
                    });

                    let stockReducido = varianteEncontrada.dataValues.STOCK - element.CANTIDAD_PRODUCTO_CARRITO;
                    let varianteActualizada = await Variante.update({STOCK: stockReducido}, {
                        where: {NUM_VARIANTE: element.NUM_VARIANTE},
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

                            let carritoActualizado = await Carrito.update({CANTIDAD_TOTAL_PRODUCTOS: cont.dataValues.TOTAL_COM}, {
                                where: {COD_AGENTE: req.user.id}
                            });

                        }
                    }

                }
            }
            let tiendaReceptora = await Tienda.findOne({
                    where: {NUM_TIENDA: req.body.ID_TIENDA}, transaction: t
                }
            );

            let notificacionCreada = await Notificacion.create({
                AGENTE_EMISOR: req.user.id,
                AGENTE_RECEPTOR: tiendaReceptora.dataValues.COD_AGENTE,
                ENVIAR_A: 'Tienda',
                ASUNTO: 'Nueva compra',
                MENSAJE: "Tienes una nueva solicitud  de compra",
                CODIGO_TIENDA: req.body.ID_TIENDA,
                NOMBRE_TIENDA:tiendaReceptora.dataValues.NOMBRE_COMERCIAL,
                CODIGO_COMPRA: compraGuardada.dataValues.NUM_COMPRA,
                ESTADO_NOTIFICACION: 0,
                FECHA_NOTIFICACION: moment(),
                HORA_NOTIFICACION: moment().format('HH:mm:ss')
            }, {
                transaction: t
            });

            let bandera = true;
            let agentes = vUsuarios;
            for (let agent of agentes) {
                for (let tienda of agent.tiendas) {
                    if (tienda.NUM_TIENDA == req.body.ID_TIENDA && bandera == true) {
                        io.in(`room_${agent.cod_agente}`).emit("notificacion", {message: "hola"});
                        bandera = false;
                    }
                }
            }


            res.status(200).send({
                message: "La compra se ha realizado correctamente su código de compra es: <br>  <strong style='font-size: xx-large'>" + compraGuardada.dataValues.NUM_COMPRA + "</strong>",
                data:notificacionCreada
            });

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
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let comprasObtenidas;
            if (req.params.meses != 0) {
                comprasObtenidas = await Compra.findAll({
                    where: {
                        COD_AGENTE: req.user.id,
                        ESTADO_COMPRA: req.params.estado,
                        FECHA_COMPRA: {[Op.between]: [moment().subtract(req.params.meses, 'months'), moment()]}
                    }, order: [['NUM_COMPRA', 'DESC']],
                    include: [{
                        model: Compra_Producto, include: {
                            model: Variante,
                            include: {model: Producto, include: {model: Oferta, include: {model: Tienda}}}
                        }
                    }, {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}]

                });
            } else {
                comprasObtenidas = await Compra.findAll({
                    where: {
                        COD_AGENTE: req.user.id,
                        ESTADO_COMPRA: req.params.estado
                    }, order: [['NUM_COMPRA', 'DESC']],
                    include: [{
                        model: Compra_Producto, include: {
                            model: Variante,
                            include: {model: Producto, include: {model: Oferta, include: {model: Tienda}}}
                        }
                    }, {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}]

                });
            }

            res.status(200).send({
                data: comprasObtenidas,
                message: "Compra obtenida correcctamente"
            });

        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getCompra(req, res) {
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

                let compraObtenida = await Compra.findOne({
                    where: {
                        NUM_COMPRA:req.params.id,
                        COD_AGENTE: req.user.id,
                    },
                    include: [{
                        model: Compra_Producto, include: {
                            model: Variante,
                            include: {model: Producto, include: {model: Oferta, include: {model: Tienda}}}
                        }
                    }, {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}]

                });

            res.status(200).send({
                data: compraObtenida,
                message: "Compra obtenida correcctamente"
            });

        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getMisComprasRecientes(req, res) {
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let comprasObtenidas = await Compra.findAll({
                where: {
                    COD_AGENTE: req.user.id,
                    FECHA_COMPRA: {[Op.between]: [moment().subtract(1, 'months'), moment()]}
                }, order: [['NUM_COMPRA', 'DESC']],
                include: [{
                    model: Compra_Producto, include: {
                        model: Variante,
                        include: {model: Producto, include: {model: Oferta, include: {model: Tienda}}}
                    }
                }, {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}]

            });


            res.status(200).send({
                data: comprasObtenidas,
                message: "Compra obtenida correcctamente"
            });

        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function getMisPedidos(req, res) {
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let pedidosObtenidos;
            if (req.body.fechaInicio != 0) {
                pedidosObtenidos = await Compra.findAll({
                    where: {
                        TIENDA: req.params.idTienda,
                        ESTADO_COMPRA: req.params.estado,
                        FECHA_COMPRA: {[Op.between]: [req.body.fechaInicio, req.body.fechaFin]}
                    }, order: [['NUM_COMPRA', 'DESC']],
                    include: [{model: Agente, required: true}, {
                        model: Compra_Producto, include: {
                            model: Variante,
                            include: {model: Producto, include: {model: Oferta, include: {model: Tienda}}}
                        }
                    }, {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}]

                });
            } else {
                pedidosObtenidos = await Compra.findAll({
                    where: {
                        TIENDA: req.params.idTienda,
                        ESTADO_COMPRA: req.params.estado
                    }, order: [['NUM_COMPRA', 'DESC']],
                    include: [{model: Agente}, {
                        model: Compra_Producto, include: {
                            model: Variante,
                            include: {model: Producto, include: {model: Oferta, include: {model: Tienda}}}
                        }
                    }, {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}]

                });
            }

            res.status(200).send({
                data: pedidosObtenidos,
                message: "Compra obtenida correcctamente"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getPedido(req, res) {
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            let pedido = await Compra.findOne({
                where: {
                    NUM_COMPRA: req.params.id
                },
                include: [{model: Agente}, {
                    model: Compra_Producto, include: {
                        model: Variante,
                        include: {model: Producto, include: {model: Oferta, include: {model: Tienda}}}
                    }
                }, {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}]

            });

            if (pedido) {
                res.status(200).send({
                    data: pedido,
                    message: "Pedido obtenido correctamente"
                });
            } else {
                res.status(402).send({
                    message: 'No existe el pedido'
                });

            }
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function updateEstadoPedido(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios", verificar
            });
        } else {

            let pedidoActualizado = await Compra.update({
                ESTADO_COMPRA: req.params.estado,
                FECHA_ENVIO: moment()
            }, {
                where: {NUM_COMPRA: req.params.id}, transaction: t
            });

            let pedido = await Compra.findOne({
                where: {NUM_COMPRA: req.params.id}, transaction: t
            });
            let tienda = await Tienda.findOne({
                where: {NUM_TIENDA: pedido.dataValues.TIENDA}, transaction: t
            });



            let notificacionCreada = await Notificacion.create({
                AGENTE_EMISOR: req.user.id,
                AGENTE_RECEPTOR: pedido.dataValues.COD_AGENTE,
                ENVIAR_A: 'Usuario',
                ASUNTO: 'Pedido tramitado',
                MENSAJE: "Tu pedido ha sido tramitado",
                CODIGO_TIENDA: pedido.dataValues.TIENDA,
                NOMBRE_TIENDA:tienda.dataValues.NOMBRE_COMERCIAL,
                CODIGO_COMPRA: pedido.dataValues.NUM_COMPRA,
                ESTADO_NOTIFICACION: 0,
                FECHA_NOTIFICACION: moment(),
                HORA_NOTIFICACION: moment().format('HH:mm:ss')
            }, {
                transaction: t
            });
            let bandera = true;
            let agentes = vUsuarios;
            for (let agent of agentes) {
                if (agent.cod_agente == pedido.dataValues.COD_AGENTE && bandera == true) {
                    io.in(`room_${agent.cod_agente}`).emit("notificacion", {message: "hola"});
                    bandera = false;
                }
            }
            res.status(200).send({
                message: "El pedido ha sido tramitado",
                data:notificacionCreada
            });
            await t.commit();

        }
    } catch (err) {
        await t.rollback()
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {
    saveComprarProducto,
    saveComprarProductoCarrito,
    getMisCompras,
    getCompra,
    getMisComprasRecientes,
    getMisPedidos,
    getPedido,
    updateEstadoPedido,

};
