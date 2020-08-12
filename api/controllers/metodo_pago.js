'use strcit'

//importar el modelo del usuario  o lo que son las clases comunes
const Metodo_Pago = require('../models/metodo_pago');
const db = require('../database/db');
const Agente= require('../models/agente');
async function saveMetodosPago(req, res) {
    const t = await db.sequelize.transaction({ autocommit: false });

    try {
        const params = req.body;
        let verificar = Agente.findOne({ where: { COD_AGENTE: req.user.id } });

        if (!verificar) {
            return res.status(500).send({
                message: "No tienes permisos necesarios"
            });
        } else {
            await Metodo_Pago.destroy({
                where: { NUM_TIENDA: req.params.id },
                transaction: t
            });

            for (const mp of params) {

                if (mp.Tipo_Pago == 'Efectivo') {
                    await Metodo_Pago.create({
                        PORCENTAJE_DESCUENTO: mp.Porcentaje_Descuento,
                        TIPO_PAGO: mp.Tipo_Pago,
                        NUM_TIENDA: req.params.id
                    },
                        {
                            transaction: t
                        });
                }

                if (mp.Tipo_Pago == 'Transferencia') {
                    await Metodo_Pago.create({
                        NUMERO_CUENTA: mp.Numero_Cuenta,
                        TIPO_CUENTA: mp.Tipo_Cuenta,
                        BANCO_PERTENECE: mp.Banco_Pertenece,
                        PORCENTAJE_DESCUENTO: mp.Porcentaje_Descuento,
                        TIPO_PAGO: mp.Tipo_Pago,
                        NUM_TIENDA: req.params.id
                    },
                        {
                            transaction: t
                        });
                }

                if (mp.Tipo_Pago == 'Electrónico') {
                    await Metodo_Pago.create({
                        API_KEY_PAYPAL: mp.Api_Key_Paypal,
                        TIPO_PAGO: mp.Tipo_Pago,
                        PORCENTAJE_RECARGO: mp.Porcentaje_Recargo,
                        NUM_TIENDA: req.params.id
                    },
                        {
                            transaction: t
                        });
                }
            }
            res.status(200).send({
                message: "Sus metodos de pago se han guardado correctamente"
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

    saveMetodosPago

};
