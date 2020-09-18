'use strict'

const Comentario = require('../models/comentario');
const Calificacion = require('../models/calificacion');
const Agente = require('../models/agente');
const moment = require('moment');
const db = require('../database/db');

async function saveValoracion(req, res) {
    const t = await db.sequelize.transaction({autocommit: false});
    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(500).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            await Comentario.create({
                    ID_PRODUCTO: req.body.ID_PRODUCTO,
                    COD_PRODUCTO: req.body.COD_PRODUCTO,
                    COD_AGENTE: req.user.id,
                    COMENTARIO: req.body.COMENTARIO,
                    FECHA_COMENTARIO: moment()
                },
                {
                    transaction: t
                });

            await Calificacion.create({
                    ID_PRODUCTO: req.body.ID_PRODUCTO,
                    COD_PRODUCTO: req.body.COD_PRODUCTO,
                    COD_AGENTE: req.user.id,
                    NUM_ESTRELLAS: req.body.CALIFICACION,
                    FECHA_CALIFICACION: moment()
                },
                {
                    transaction: t
                });

            res.status(200).send({
                message: "Su valoración se ha guardado correctamente"
            });
            await t.commit();
        }
    } catch (err) {
        await t.rollback();
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


module.exports = {          // para exportar todas las funciones de este modulo
    saveValoracion
};
