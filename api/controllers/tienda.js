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
    let sucursal = SUCURSAL.build();

    tienda.RAZON_SOCIAL = req.body.Tienda.Razon_Social;
    tienda.NOMBRE_COMERCIAL = req.body.Tienda.Nombre_Comercial;
    tienda.CORREO_TIENDA = req.body.Tienda_Enviar.Tienda.Correo_Tienda;
    tienda.LINK_PAGINA = req.body.Tienda_Enviar.Tienda.Link_Pagina;
    tienda.LINK_FACEBOOK = req.body.Tienda_Enviar.Tienda.Link_Facebook;
    tienda.DESCRIPCION_TIENDA = req.body.Tienda_Enviar.Tienda.Descripcion_Tienda;
    tienda.TERMINOS_CONDICIONES = req.body.Tienda_Enviar.Tienda.Terminos_Condiciones;
    tienda.LOGO = req.body.Tienda_Enviar.Tienda.Logo;
    tienda.BANNER = req.body.Tienda_Enviar.Tienda.Banner;


    console.log("ESTO ESTA EN EL BACKEN "+ tienda);


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
