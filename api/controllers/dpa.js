'use strcit'

const bcrypt = require('bcrypt-nodejs');
var DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
var mysql = require('mysql');

async function getDpaProvincias(req, res) {
    var busqueda = req.params.id;
    console.log(busqueda);
    try {
        let dpa = await DPA.findAll({where: {Tipo: req.params.id}});

        if (dpa.length) {
            res.status(200).send({
                data: dpa,
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

async function getDpaCiudades(req, res) {
    var busqueda = req.params.id;
    console.log(busqueda);
    try {
        let dpa = await DPA.findAll({where: {DPA_COD_DPA: req.params.id}});

        if (dpa.length) {
            res.status(200).send({
                data: dpa,
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

/*const dpa = await DPA.findAll({where:{Tipo:"P"}}).then(dpa=>  {

  if (!dpa) {
       res.status(404).send({
           message: 'No existe DPA registrada en la base de datos'
       });
   } else {
       res.status(200).send({
           message: 'Se ha obtenido la DPA correctamente',
           data:dpa
       });

   }
return dpa;

}).catch(err=>{

   res.status(500).send({
       message: 'error:'+err
   });

});

console.log("lo logre", JSON.stringify(dpa));*/


module.exports = {          // para exportar todas las funciones de este modulo

    getDpaProvincias,
    getDpaCiudades

};
