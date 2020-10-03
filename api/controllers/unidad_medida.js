'use strict'

const Unidad_Medida = require('../models/unidad_medida'); //importar el modelo del usuario  o lo que son las clases comunes
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function getUnidadesMedida(req, res) {
    try {
        let unidadesMedidaObtenidas = await Unidad_Medida.findAll({
            where: {UNI_COD_UNIDAD_MEDIDA: {[Op.ne]: 'N/A'}},
            order: [['UNI_COD_UNIDAD_MEDIDA', 'ASC']]
        }); // [Op.ne] es diferente

        if (unidadesMedidaObtenidas.length > 0) {
            res.status(200).send({
                data: unidadesMedidaObtenidas,
                message: "Unidades de medida cargadas correctamente"
            });
        } else {
            res.status(402).send({
                message: 'No existen unidades de medida registradas en la base de datos'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo
    getUnidadesMedida
};
