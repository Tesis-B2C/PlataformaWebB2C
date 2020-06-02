'use strict'

const moment = require('moment');
const TIENDA = require('../models/tienda'); //importar el modelo del usuario  o lo que son las clases comunesvar DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
const SUCURSAL = require('../models/sucursal');
const jwt = require('../services/jwt');

async function registrarTienda(req, res) {
    /*    try {
         let agenteEncontrado = await AGENTE.findOne({where: {CORREO: req.body.Correo}});

           if (agenteEncontrado) {
               res.status(404).send({
                   message: 'Este correo electronico ya esta vinculado a una cuenta'
               });
           } else {*/
            let tienda = TIENDA.build();
            tienda.razon_Social = req.body.Tienda_Enviar.Tienda.Razon_Social;
            console.log(tienda.razon_Social);




/*            let agenteGuardado = await agente.save();
            if (agenteGuardado) {
                let TOKENTEMPORAL = jwt.createToken24h(agente);
                let respuestaCorreo = await correo.EnviarCorreo(agente.CORREO, 'Activación de cuenta', agente.NOMBRE, TOKENTEMPORAL);
                if (respuestaCorreo == 'error') {
                    res.status(500).send({
                        message: 'Parece que hay un error en tu correo electrónico'
                    });
                } else if (req.body.Num_Cod_Postal) {
                    res.status(200).send({
                        message: 'Por favor revisa tu correo electrónico para activar tu cuenta '
                    });
                } else {
                    res.status(200).send({
                        message: 'No se ha registrado una dirección aun, esperamos lo puedas hacer pronto,' +
                            'Porfavor revisa tu correo electrónico para activar tu cuenta'
                    });
                }
            } else {
                res.status(500).send({
                    message: 'No se han podido registrar tus datos intenta nuevamente'
                });
            }*/


     /*   }
    } catch (err) {
        res.status(500).send({
            message: err.name
        });
    }*/
}

module.exports = {          // para exportar todas las funciones de este modulo
    registrarTienda
};
