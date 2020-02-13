'use strcit'

const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');


var Agente = require('../models/agente'); //importar el modelo del usuario  o lo que son las clases comunes
var jwt = require('../services/jwt');



var mysql = require('mysql');

async  function guardarAgente(req, res) {


    const userData ={
        Nombre:req.body.nombre,
        Apellido:req.body.apellido

    }

    let nuevoAgente = await Agente.create(userData).then( userstored=>  {

        if (!userstored) {
            res.status(404).send({
                message: 'No se ha registrado el insumo'
            });
        } else {
            res.status(200).send({
                message: 'El Insumo se ha registrado correctamente',
                data:userstored
            });

        }


    }).catch(err=>{

        res.status(500).send({
            message: 'se perdio la conexion'
        });

    });


}


module.exports = {          // para exportar todas las funciones de este modulo

    guardarAgente,

};
