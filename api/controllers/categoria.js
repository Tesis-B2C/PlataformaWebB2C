'use strcit'

const Categoria = require('../models/categoria'); //importar el modelo del usuario  o lo que son las clases comunes


async function getCategorias(req, res) {

    try {
        let categoriasObtenidas = await Categoria.findAll({order:[['ID_CATEGORIA','ASC']]});//{include:[{model:Categoria,as: 'CAT',require:true}],

        if (categoriasObtenidas.length) {
            res.status(200).send({
                data: categoriasObtenidas,
                message: "Dpa cargado correctamente"
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

    getCategorias,


};
