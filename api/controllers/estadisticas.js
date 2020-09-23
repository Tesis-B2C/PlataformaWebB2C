'use strict'

const DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes

async function getVentas(req, res) {
    let busqueda = req.params.id;

    try {
        let provinciasObtenidas = await DPA.findAll({where: {TIPO: req.params.id}, order: [['NOMBRE', 'ASC']]});

        if (provinciasObtenidas.length > 0) {
            res.status(200).send({
                data: provinciasObtenidas,
                message: "DPA cargado correctamente"
            });
        } else {
            res.status(404).send({
                message: 'No existe DPA registrada en la base de datos'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}




module.exports = {          // para exportar todas las funciones de este modulo
    getVentas,

};
