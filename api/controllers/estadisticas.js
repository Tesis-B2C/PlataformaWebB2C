'use strict'

const Compra = require('../models/compra'); //importar el modelo del usuario  o lo que son las clases comunes
const Agente = require('../models/agente');
const Oferta = require('../models/oferta');
const Producto = require('../models/producto');
const Calificacion = require('../models/calificacion');
const Tienda = require('../models/tienda');
const Descuento = require('../models/descuento');

const {Op} = require("sequelize");

async function getVentas(req, res) {
    let busqueda = req.params.id;
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let ventasObtenidas = await Compra.findAndCountAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id},
            });

            res.status(200).send({
                data: ventasObtenidas.count,
                message: "Productos cargados correctamente"
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
            return res.status(500).send({
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
                message: "Productos cargados correctamente"
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
            return res.status(500).send({
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
            return res.status(500).send({
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
            return res.status(500).send({
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
            return res.status(500).send({
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
            return res.status(500).send({
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
                message: "Métodos de envío cargados correctamente"
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
            return res.status(500).send({
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

module.exports = {          // para exportar todas las funciones de este modulo
    getVentas,
    getCalificaciones,
    getProductos,
    getVisitas,
    getMetodosPago,
    getMetodosEnvio,
    getDescuentos,
    getVentasMensuales
};
