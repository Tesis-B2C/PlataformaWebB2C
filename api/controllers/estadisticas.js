'use strict'

const Compra = require('../models/compra'); //importar el modelo del usuario  o lo que son las clases comunes
const Agente = require('../models/agente');
const Oferta = require('../models/oferta');
const Producto = require('../models/producto');
const Calificacion = require('../models/calificacion');
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
            let ventasObtenidas = await Compra.findAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {TIENDA: req.params.id, ESTADO_COMPRA: {[Op.or]: [0, 1, 2]}},
                attributes: ['NUM_COMPRA', [Compra.sequelize.fn('count', Compra.sequelize.col('NUM_COMPRA')), 'COMPRAS_COUNT']],
            });

            res.status(200).send({
                data: ventasObtenidas,
                message: "Productos cargados correctamente"
            });

        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}
async function getCalificaciones(req, res){
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
                include:{model:Producto,include: {model:Calificacion,
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
            let productosObtenidos = await Oferta.findAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
                where: {NUM_TIENDA: req.params.id, ESTADO_OFERTA:0},
                attributes: ['ID_OFERTA', [Compra.sequelize.fn('count', Compra.sequelize.col('ID_OFERTA')), 'OFERTAS_COUNT']],
            });

            res.status(200).send({
                data: productosObtenidos,
                message: "Productos cargados correctamente"
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
    getProductos
};
