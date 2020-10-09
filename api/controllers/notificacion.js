'use strict'

const Notificacion = require('../models/notificacion'); //importar el modelo del usuario  o lo que son las clases comunes

async function getMisNotificaciones(req, res) {


    try {
        let NotificacionesObtenidas = await Notificacion.findAll({
            where: {AGENTE_RECEPTOR:req.user.id},
            order: [['ID_NOTIFICACION', 'DESC']]
        });

        res.status(200).send({
            data: NotificacionesObtenidas,
            message: "Notificaciones cargadas correctamente"
        });

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


module.exports = {          // para exportar todas las funciones de este modulo
    getMisNotificaciones
};
