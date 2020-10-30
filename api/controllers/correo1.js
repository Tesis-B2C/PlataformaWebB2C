'use strict'
const Agente = require('../models/agente');
const Tienda = require('../models/tienda');
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
const jwt = require('../services/jwt');

const {GLOBAL}= require('../global');


// email sender function
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure:false,
    auth: {
        user: 'comdero.notificaciones@gmail.com',
        pass: 'comdero1234'
    }
});

function correoActivacion(req, res) {

    // console.log(" datos que entraro a correo ", req.body);
    let token = jwt.createToken24h(req.body);
    var mailOptions = {
        from: 'doginotificaciones@gmail.com',
        to: req.body.CORREO,
        subject: 'Activación de cuenta',
       // text: 'Hola' + req.body.NOMBRE + ', Gracias por registrarte en "COMDERO". ' + 'Porfavor da click en el siguiente link para completar la activacion:'+GLOBAL.url+'loguin',
        html: 'Hola<strong> ' + req.body.NOMBRE + '</strong>,<br><br>Gracias por registrarte en ' +
            '"COMDERO". Por favor da clic en el siguiente link para completar la activación:<br><br><a ' +
            'href="'+GLOBAL.url+'login/' + token + '">'+GLOBAL.url+'login/</a>'
    };

    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
            res.status(402).send({
                message: "Al parecer existe un error al enviar el correo, inténtelo nuevamente" + error
            });
        } else {

            res.status(200).send({
                message: "El correo ha sido enviado por favor verifíquelo"
            });
        }
    });

}

function correoCambioContrasenia(req, res) {


    // console.log(" datos que entraro a correo de cambio de contrasenia  ", req.body);
    let token = jwt.createToken24h(req.body);

    var mailOptions = {
        from: 'doginotificaciones@gmail.com',
        to: req.body.CORREO,
        subject: 'Cambio de contraseña',
        //text: 'Hola' + req.body.NOMBRE + ', Gracias por registrarte en "COMDERO". Por favor da clic en el siguiente link para poder cambiar su contraseña:' +GLOBAL.url+'olvido-contrasenia-paso2/' + token,
        html: 'Hola<strong> ' + req.body.NOMBRE + '</strong>,<br><br>Gracias por registrarte en "COMDERO". ' +
            'Por favor da clic en el siguiente link para cambiar su contraseña:<br><br>' +
            '<a href="'+GLOBAL.url+'olvido-contrasenia-paso2/' + token + '">' +
            GLOBAL.url+'olvido-contrasenia-paso2/</a>'

    };


    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
            res.status(402).send({
                message: "Al parecer existe un error al enviar el correo, inténtelo nuevamente" + error
            });
        } else {

            res.status(200).send({
                message: "El correo ha sido enviado por favor verifíquelo"
            });
        }
    });


}


function correoCambioCorreo(req, res) {

    // console.log(" datos que entraro a correo de cambio de contrasenia  ", req.body);
    var mailOptions = {
        from: 'doginotificaciones@gmail.com',
        to: req.body.correo,
        subject: 'Cambio de correo',
        text: 'Tu código de verificación es ' + req.body.codigo,

    };

    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
            res.status(402).send({
                message: "Al parecer existe un error al enviar el correo, inténtelo nuevamente" + error
            });
        } else {
            res.status(200).send({
                message: "El correo ha sido enviado por favor verifíquelo"
            });
        }
    });


}

async function  correoNuevaCompra(req, res) {

    let agente_emisor= await Agente.findOne({where:{COD_AGENTE:req.body.AGENTE_EMISOR}});
    let agente_receptor= await Agente.findOne({where:{COD_AGENTE:req.body.AGENTE_RECEPTOR}});
    let tienda= await Tienda.findOne({where:{NUM_TIENDA:req.body.CODIGO_TIENDA}});

    // console.log(" datos que entraro a nueva cpmra  ", req.body);
    var mailOptions = {
        from: 'doginotificaciones@gmail.com',
        to: agente_receptor.dataValues.CORREO,
        cc:tienda.dataValues.CORREO_TIENDA,
        subject: req.body.ASUNTO,
        //text: req.body.MENSAJE + ' de: ' + agente_emisor.dataValues.NOMBRE+' por favor revisa COMDERO para más detalle de la compra No :'+req.body.CODIGO_COMPRA,
        html:  req.body.MENSAJE + ' de: ' + agente_emisor.dataValues.NOMBRE+' por favor revisa: &nbsp; <a href="'+GLOBAL.url+'principales/menu/principal">comdero.com/</a> &nbsp; para más detalle de la compra No:'+req.body.CODIGO_COMPRA
    };

    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
            res.status(402).send({
                message: "Al parecer existe un error al enviar el correo de confirmación, inténtelo nuevamente" + error
            });
        } else {
            res.status(200).send({
                message: "El correo ha sido enviado por favor verifíquelo"
            });
        }
    });


}


async function correoPedidoTramitado(req, res) {

    let agente_emisor= await Agente.findOne({where:{COD_AGENTE:req.body.AGENTE_EMISOR}});
    let agente_receptor= await Agente.findOne({where:{COD_AGENTE:req.body.AGENTE_RECEPTOR}});
    let tienda= await Tienda.findOne({where:{NUM_TIENDA:req.body.CODIGO_TIENDA}});

    // console.log(" datos que entraro a nueva cpmra  ", req.body);
    var mailOptions = {
        from: 'doginotificaciones@gmail.com',
        to: agente_receptor.dataValues.CORREO,
        subject: req.body.ASUNTO,
       // text: req.body.MENSAJE + ' por: ' + req.body.NOMBRE_TIENDA+' por favor revisa COMDERO para más detalle de la compra No :'+req.body.CODIGO_COMPRA,
        html:  req.body.MENSAJE + ' por: ' +req.body.NOMBRE_TIENDA+' por favor revisa: &nbsp; <a href="'+GLOBAL.url+'principales/menu/mi-cuenta/menu-mi-cuenta/detalle-pedido-realizado/'+req.body.CODIGO_COMPRA+'>comdero.com/</a> &nbsp; para más detalle de la compra No:'+req.body.CODIGO_COMPRA
    };

    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
            res.status(402).send({
                message: "Al parecer existe un error al enviar el correo de confirmación, inténtelo nuevamente" + error
            });
        } else {
            res.status(200).send({
                message: "El correo ha sido enviado por favor verifíquelo"
            });
        }
    });


}

module.exports = {
    correoActivacion,
    correoCambioContrasenia,
    correoCambioCorreo,
    correoNuevaCompra,
    correoPedidoTramitado
};
