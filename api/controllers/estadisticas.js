'use strict'

const Imagen_Producto = require('../models/imagen_producto');

const Compra = require('../models/compra'); //importar el modelo del usuario  o lo que son las clases comunes
const Agente = require('../models/agente');
const Oferta = require('../models/oferta');
const Producto = require('../models/producto');
const Calificacion = require('../models/calificacion');
const Tienda = require('../models/tienda');
const Descuento = require('../models/descuento');
const Compra_Producto = require('../models/compra_producto');
const Variante = require('../models/variante');
const {Op} = require("sequelize");
const Carrito = require('../models/carrito');
const Carrito_Producto = require('../models/carrito_producto');

async function getVentas(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let ventasObtenidas = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id},
            });

            res.status(200).send({
                data: ventasObtenidas.count,
                message: "Ventas cargadas correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getCalificaciones(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let calificacionesObtenidas = await Oferta.findAll({
                where: {NUM_TIENDA: req.params.id},
                include: {
                    model: Producto, include: {
                        model: Calificacion,
                        attributes: ['ID_CALIFICACION', [Calificacion.sequelize.fn('avg', Producto.sequelize.col('NUM_ESTRELLAS')), 'CALIFICACION_AVG']],
                    }
                }
            });

            res.status(200).send({
                data: calificacionesObtenidas,
                message: "Calificaciones cargadas correctamente"
            });
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getProductos(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let productosObtenidos = await Oferta.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {NUM_TIENDA: req.params.id, ESTADO_OFERTA: 0},

            });

            res.status(200).send({
                data: productosObtenidos.count,
                message: "Productos cargados correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getVisitas(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let visitasObtenidas = await Tienda.findOne({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {NUM_TIENDA: req.params.id},
                attributes: ['VISITAS'],
            });

            res.status(200).send({
                data: visitasObtenidas,
                message: "Productos cargados correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function getMetodosPago(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let Efectivo = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id, METODO_PAGO: 'Efectivo'},
            });

            let Transferencia = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id, METODO_PAGO: 'Transferencia'},
            });

            let PayPal = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id, METODO_PAGO: 'Electrónico'},
            });
            let obj = {
                Efectivo: Efectivo.count,
                Transferencia: Transferencia.count,
                PayPal: PayPal.count
            }
            res.status(200).send({
                data: obj,
                message: "Métodos de pago cargados correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function getMetodosEnvio(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let Retiro = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id, METODO_ENVIO: 'Retiro'},
            });

            let Acordar = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id, METODO_ENVIO: 'Acordar'},
            });

            let Domicilio = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id, METODO_ENVIO: 'Domicilio'},
            });
            let obj = {
                Retiro: Retiro.count,
                Acordar: Acordar.count,
                Domicilio: Domicilio.count
            }
            res.status(200).send({
                data: obj,
                message: "Métodos de envío cargados correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getDescuentos(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let Cupon = await Descuento.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {NUM_TIENDA: req.params.id, TIPO_DESCUENTO: 'Cupón'},
            });

            let Automatico = await Descuento.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {NUM_TIENDA: req.params.id, TIPO_DESCUENTO: 'Áutomático'},
            });

            let obj = {
                Cupon: Cupon.count,
                Automatico: Automatico.count,

            }
            res.status(200).send({
                data: obj,
                message: "Descuentos cargados correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function getVentasMensuales(req, res) {
    let busqueda = req.params.id;

    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let compras = await Compra.findAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id},
                attributes: ['FECHA_COMPRA'],

            });


            res.status(200).send({
                data: compras,
                message: "Ventas cargadas correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getVentasVisitas(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let Visitas = await Tienda.findOne({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {NUM_TIENDA: req.params.id},
                attributes: ['VISITAS'],

            });

            let Ventas = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id},
            });

            let obj = {
                Visitas: Visitas.dataValues.VISITAS,
                Ventas: Ventas.count,

            }
            res.status(200).send({
                data: obj,
                message: "Ventas y visitas cargadas correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getProductoMasVendido(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {


            let Prodducto = await Compra.findAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id}, attributes: ['NUM_COMPRA'], include: {
                    model: Compra_Producto,
                    attributes: ['NUM_VARIANTE']
                }

            });


            res.status(200).send({
                data: Prodducto,
                message: "Producto cargado correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getProductoDetalleMasVendido(req, res) {

    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let productoObtenido = await Variante.findOne({
                where: {NUM_VARIANTE: req.params.id},
                include: [{
                    model: Producto, include: [
                        {
                            model: Calificacion,
                            separate: true,
                            attributes: ['ID_PRODUCTO', 'COD_PRODUCTO', [Calificacion.sequelize.fn('AVG', Calificacion.sequelize.col('NUM_ESTRELLAS')), 'PROMEDIO_CAL']],
                            group: ['ID_PRODUCTO']
                        }, {model: Oferta}]
                }, {
                    model: Imagen_Producto, separate: true,
                    order: [['ID_IMAGEN', 'ASC']]
                }],
            })


            res.status(200).send({
                data: productoObtenido,
                message: "Producto cargado correctamente"
            });
        }
    } catch
        (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

// usuario


async function getEstadisticaCarrito(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let Car = await Carrito.findOne({
                where: {COD_AGENTE: req.params.id},
            });

            let carritoObtenido = await Carrito_Producto.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {ID_CARRITO: Car.dataValues.ID_CARRITO},
            });

            res.status(200).send({
                data: carritoObtenido.count,
                message: "Productos del carrito cargados correctamente"
            });
        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getEstadisticaPedidosRealizados(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let realizados = await Compra.findAndCountAll({
                where: {COD_AGENTE: req.params.id, ESTADO_COMPRA:0},
            });
            let espera = await Compra.findAndCountAll({
                where: {COD_AGENTE: req.params.id, ESTADO_COMPRA:1},
            });
            let entregados = await Compra.findAndCountAll({
                where: {COD_AGENTE: req.params.id, ESTADO_COMPRA:2},
            });

            let obj={
                realizados:realizados.count,
                espera:espera.count,
                entregados:entregados.count

            }

            res.status(200).send({
                data: obj,
                message: "Pedidos realizados cargados correctamente"
            });
        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo
    getVentas,
    getCalificaciones,
    getProductos,
    getVisitas,
    getMetodosPago,
    getMetodosEnvio,
    getDescuentos,
    getVentasMensuales,
    getVentasVisitas,
    getProductoMasVendido,
    getProductoDetalleMasVendido,
    getEstadisticaCarrito,
    getEstadisticaPedidosRealizados

};
