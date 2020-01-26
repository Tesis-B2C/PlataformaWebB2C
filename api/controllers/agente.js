'use strcit'

var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');


var Agente = require('../models/agente'); //importar el modelo del usuario  o lo que son las clases comunes
//var Materia = require('../models/materia'); //importar el modelo del usuario  o lo que son las clases comunes
//var jwt = require('../services/jwt');



// Create a new moment object


// Create a moment in the past, using a string date


// Create a new moment using an array

var mysql = require('mysql2');

function guardarAgente(req, res) {

    var params = req.body; // cuerpo de la peticion post de la direccion http por post

    const userData ={
        Nombre:req.body.nombre,
        Apellido:req.body.apellido

    }



    /*Docente.create(userData).then(user=>{
        res.status(200).send({
            message: 'El Insumo se ha registrado correctamente'
        });

    });*/
    Agente.create(userData).then( userstored=>  {

        if (!userstored) {
            res.status(404).send({
                message: 'No se ha registrado el insumo'
            });
        } else {
            res.status(200).send({
                message: 'El Insumo se ha registrado correctamente'
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
