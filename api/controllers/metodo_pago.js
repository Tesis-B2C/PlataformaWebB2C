'use strcit'

//importar el modelo del usuario  o lo que son las clases comunes
const Metodo_Pago = require('../models/metodo_pago');
const db = require('../database/db');
async function saveMetodosPago(req, res) {

    console.log("objetos de productos", req.body);
    const t = await db.sequelize.transaction({autocommit: false});
    const params = req.body;
    try {

        await Metodo_Pago.destroy({
            where: {NUM_TIENDA: req.params.id},
            transaction: t
        });

        for (const mp of params) {

            if (mp.Tipo_Pago == 'Efectivo') {
                await Metodo_Pago.create({
                        PROCENTAJE_DESCUENTO: mp.Procentaje_Descuento,
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
                        PORCENTAJE_DESCUENTO: mp.Porcentaje_Descuento,
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
