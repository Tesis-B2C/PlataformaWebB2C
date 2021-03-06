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
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            if (req.body.COMENTARIO) {

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
            }

            if (req.body.CALIFICACION) {
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
            }

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

async function updateComentario(req, res) {

    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let comentarioActualizado = await Comentario.update({
                COMENTARIO: req.body.COMENTARIO,
            }, {
                where: {ID_COMENTARIO: req.params.id},
            });


            if (comentarioActualizado>0) {
                res.status(200).send({
                    message: "El comentario ha sido actualizado correctamente"
                });
            } else {
                res.status(402).send({
                    message: 'Al parecer no existe el comentario registrado en la base de datos'
                });
            }
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function deleteComentario(req, res) {

    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let comentarioBorrado = await Comentario.destroy({
                where: {ID_COMENTARIO: req.params.id},
            });


            if (comentarioBorrado) {
                res.status(200).send({
                    message: "El comentario ha sido borrado"
                });
            } else {
                res.status(402).send({
                    message: 'Al parecer no existe el comentario registrado en la base de datos'
                });
            }
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo
    saveValoracion,
    updateComentario,
    deleteComentario
};
