'use strcit'

//importar el modelo del usuario  o lo que son las clases comunes


const Producto_Descuento = require('../models/producto_descuento');
const Descuento = require('../models/descuento');
const Producto=require('../models/producto')
const db = require('../database/db');
const moment = require('moment');
const {Op} = require("sequelize");


async function saveDescuento(req, res) {
    console.log("objetos de productos", req.body);
    const t = await db.sequelize.transaction({autocommit: false});
    const params = req.body;
    try {

        let descuentoCreado = await Descuento.create({
                MOTIVO_DESCUENTO: params.Descuento.Motivo_Descuento.toUpperCase(),
                NUM_TIENDA: req.params.id,
                PORCENTAJE_DESCUENTO: params.Descuento.Porcentaje_Descuento,
                FECHA_INICIO: params.Descuento.Fecha_Inicio,
                FECHA_FIN: params.Descuento.Fecha_FIn,
                TIPO_DESCUENTO: params.Descuento.Tipo_Descuento,
                HORA_INICIO: params.Descuento.Hora_Inicio,
                HORA_FIN: params.Descuento.Hora_Fin,
                ESTADO_DESCUENTO: params.Descuento.Estado_Descuento,
                APLICARA:params.Descuento.AplicarA
            },
            {
                transaction: t
            });
        for (const p of params.vProductos) {
            await Producto_Descuento.create({
                    ID_DESCUENTO: descuentoCreado.dataValues.ID_DESCUENTO,
                    ID_PRODUCTO: p.ID_OFERTA,
                    COD_PRODUCTO: p.PRODUCTO.COD_PRODUCTO,
                    FECHA_ASIGNACION_DESCUENTO: moment(),
                    ESTADO_ASIGNACION_DESCUENTO: descuentoCreado.dataValues.ESTADO_DESCUENTO,
                },
                {
                    transaction: t
                }
            );
        }
        res.status(200).send({
            message: "Su descuento ha sido creado correctamente"
        });
        await t.commit();

    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function getMisDescuentos(req, res) {
    try {
        let descuentoObtenidos = await Descuento.findAll({ //$or: [{ESTADO_OFERTA: 0},{ESTADO_OFERTA: 1}]
            where: {NUM_TIENDA: req.params.id, ESTADO_DESCUENTO: {[Op.or]: [0, 1]}}, order: [['ID_DESCUENTO', 'DESC']]
        });

        if (descuentoObtenidos.length) {
            res.status(200).send({
                data: descuentoObtenidos,
                message: "Productos cargadas correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer no se encuentra productos registrados en la base de datos'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }

}

async function updateEstadoDescuento(req, res) {
    try {
        let descuentoActualizado = await Descuento.update({
            ESTADO_DESCUENTO: req.body.estado,
        }, {
            where: {ID_DESCUENTO: req.params.id},
        });
        if (descuentoActualizado) {
            res.status(200).send({
                message: "El descuento ha sido actualizado correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer no se encuentra un descuento  registrado en la base de datos'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function getDescuento(req, res) {
    try {
        let descuentoObtenido = await Descuento.findOne({
            where: {ID_DESCUENTO: req.params.id},include:{model:Producto_Descuento,where:{ID_DESCUENTO: req.params.id}, include:{model:Producto, as: 'producto'}}
        });

        if (descuentoObtenido) {
            res.status(200).send({
                data: descuentoObtenido,
                message: "Descuento cargado correctamente"
            });
        } else {
            res.status(404).send({
                message: 'Al parecer no se encuentra el descuento registrado en la base de datos'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }

}


module.exports = {          // para exportar todas las funciones de este modulo

    saveDescuento,
    getMisDescuentos,
    updateEstadoDescuento,
    getDescuento

};
