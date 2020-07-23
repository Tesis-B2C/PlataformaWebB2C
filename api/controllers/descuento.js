'use strcit'

//importar el modelo del usuario  o lo que son las clases comunes
const Descuento = require('../models/descuento');
const Producto_Descuento = require('../models/producto_descuento')
const db = require('../database/db');
const moment = require('moment');

async function saveDescuento(req, res) {
    console.log("objetos de productos", req.body);
    const t = await db.sequelize.transaction({autocommit: false});
    const params = req.body;
    try {

        let descuentoCreado = await Descuento.create({
                MOTIVO_DESCUENTO: params.Descuento.Motivo_Descuento,
                PORCENTAJE_DESCUENTO: params.Descuento.Porcentaje_Descuento,
                FECHA_INICIO: params.Descuento.Fecha_Inicio,
                FECHA_FIN: params.Descuento.Fecha_FIn,
                TIPO_DESCUENTO: params.Descuento.Fecha_Inicio,
                HORA_INICIO: params.Descuento.Hora_Inicio,
                HORA_FIN: params.Descuento.Hora_Fin,
                ESTADO_DESCUENTO:params.Descuento.Estado_Descuento
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

module.exports = {          // para exportar todas las funciones de este modulo

    saveDescuento

};
