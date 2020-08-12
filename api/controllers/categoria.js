'use strict'

const Categoria = require('../models/categoria'); //importar el modelo del usuario  o lo que son las clases comunes


async function getCategorias(req, res) {

    try {
        let categoriasObtenidas = await Categoria.findAll({order: [['ID_CATEGORIA', 'ASC']]});//{include:[{model:Categoria,as: 'CAT',require:true}],

        if (categoriasObtenidas.length > 0) {
            res.status(200).send({
                data: categoriasObtenidas,
                message: "Categorías cargadas correctamente"
            });
        } else {
            res.status(404).send({
                message: 'No existen categorías registradas en la base de datos'
            });
        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo
    getCategorias,
};
