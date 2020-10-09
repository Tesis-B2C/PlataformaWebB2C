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
            let NotificacionesObtenidas = await Notificacion.findAll({
                where: {AGENTE_RECEPTOR: req.user.id}, include: [{model: Agente}]
            });

            res.status(200).send({
                data: NotificacionesObtenidas,
                message: "Notificaciones cargadas correctamente"
            });
        }

    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}


module.exports = {          // para exportar todas las funciones de este modulo
    getMisNotificaciones
};
