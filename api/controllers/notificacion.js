'use strict'

const Notificacion = require('../models/notificacion'); //importar el modelo del usuario  o lo que son las clases comunes
const Agente = require('../models/agente');

async function getMisNotificaciones(req, res) {
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let NotificacionesObtenidasLimitadas = await Notificacion.findAll({
                where: {AGENTE_RECEPTOR: req.user.id}, include: [{model: Agente}],
                order: [['ID_NOTIFICACION', 'DESC']], limit: 3

            });
            let NotificacionesObtenidas = await Notificacion.findAll({
                where: {AGENTE_RECEPTOR: req.user.id, ESTADO_NOTIFICACION: 0}, include: [{model: Agente}],
                order: [['ID_NOTIFICACION', 'DESC']],
            });

            let NotificacionesObtenidasCompletas = await Notificacion.findAll({
                where: {AGENTE_RECEPTOR: req.user.id}, include: [{model: Agente}],
                order: [['ID_NOTIFICACION', 'DESC']],
            });


            let obj = {
                limitadas: NotificacionesObtenidasLimitadas,
                todas: NotificacionesObtenidas,
                completas:NotificacionesObtenidasCompletas
            }

            res.status(200).send({
                data: obj,
                message: "Notificaciones cargadas correctamente"
            });
        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function getMisNotificacionesTienda(req, res) {
    let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});
    try {
        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let NotificacionesObtenidasLimitadas = await Notificacion.findAll({
                where: {CODIGO_TIENDA: req.params.id,ENVIAR_A:'Tienda'}, include: [{model: Agente}],
                order: [['ID_NOTIFICACION', 'DESC']], limit: 3

            });
            let NotificacionesObtenidas = await Notificacion.findAll({
                where: {CODIGO_TIENDA: req.params.id, ESTADO_NOTIFICACION: 0,ENVIAR_A:'Tienda'}, include: [{model: Agente}],
                order: [['ID_NOTIFICACION', 'DESC']],

            });
            let NotificacionesObtenidasCompletas = await Notificacion.findAll({
                where: {AGENTE_RECEPTOR: req.user.id,ENVIAR_A:'Tienda'}, include: [{model: Agente}],
                order: [['ID_NOTIFICACION', 'DESC']],
            });
            let obj = {
                limitadas: NotificacionesObtenidasLimitadas,
                todas: NotificacionesObtenidas,
                completas:NotificacionesObtenidasCompletas
            }

            res.status(200).send({
                data: obj,
                message: "Notificaciones cargadas correctamente"
            });
        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


async function updateEstadoNotificacion(req, res) {

    try {
        let verificar = await Agente.findOne({where: {COD_AGENTE: req.user.id}});

        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {
            let notificacionActualizada = await Notificacion.update({
                ESTADO_NOTIFICACION: req.body.estado,
            }, {
                where: {ID_NOTIFICACION: req.params.id},

            });


            res.status(200).send({
                message: "La notificación ha sido actualizada correctamente"
            });

        }
    } catch (err) {

        res.status(500).send({
            message: 'error:' + err
        });
    }
}


module.exports = {          // para exportar todas las funciones de este modulo
    getMisNotificaciones,
    getMisNotificacionesTienda,
    updateEstadoNotificacion
};
