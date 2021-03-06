'use strict'

//importar el modelo del usuario  o lo que son las clases comunes
const Opcion_Envio = require('../models/opcion_envio');
const Agente= require('../models/agente');
const db = require('../database/db');

async function guardarMetodoEnvio(req, res) {
    const t = await db.sequelize.transaction({ autocommit: false });
    try {
        const params = req.body;
        let verificar = await Agente.findOne({ where: { COD_AGENTE: req.user.id } });

        if (!verificar) {
            return res.status(401).send({
                message: "No tiene los permisos necesarios"
            });
        } else {

            await Opcion_Envio.destroy({
                where: { NUM_TIENDA: req.params.id },
                transaction: t
            });

            for (const me of params) {
                await Opcion_Envio.create({
                    NUM_TIENDA: req.params.id,
                    TIPO_ENVIO: me.Tipo_Envio,
                    TIPO_UBICACION: me.Tipo_Ubicacion,
                    TIPO_MEDIDA: me.Tipo_Medida,
                    HORA_ESTIMADA_RETIRO: me.Hora_Estimada_Retiro,
                    INSTRUCCION_RETIRO: me.Instruccion_Retiro,
                    MINIMO: me.Minimo,
                    MAXIMO: me.Maximo,
                    PRECIO: me.Precio,
                },
                    {
                        transaction: t
                    });
            }
            res.status(200).send({
                message: "Sus métodos de envío se han guardado correctamente"
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
    guardarMetodoEnvio
};
