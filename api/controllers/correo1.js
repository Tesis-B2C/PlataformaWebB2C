'use strict'
var bcrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
const jwt = require('../services/jwt');
// email sender function
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'doginotificaciones@gmail.com',
        pass: 'dogi12345.'
    }
});

function correoActivacion(req, res) {

    console.log(" datos que entraro a correo ", req.body);
    let token = jwt.createToken24h(req.body);
    var mailOptions = {
        from: 'doginotificaciones@gmail.com',
        to: req.body.CORREO,
        subject: 'Activación de cuenta',
        text: 'Hola' + req.body.NOMBRE + ', Gracias por registrarte en "COMDERO". ' + 'Porfavor da click en el siguiente link para completar la activacion: http://localhost:4200/loguin/',
        html: 'Hola<strong> ' + req.body.NOMBRE + '</strong>,<br><br>Gracias por registrarte en ' +
            '"COMDERO". Porfavor da click en el siguiente link para completar la activacion:<br><br><a ' +
            'href="http://localhost:4200/loguin/' + token + '">http://localhost:4200/loguin/</a>'
    };

    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
            res.status(500).send({
                message: "Al parecer existe un error intentelo nuevamente" + error
            });
        } else {

            res.status(200).send({
                message: "El correo ha sido enviado porfavor verifiquelo"
            });
        }
    });

}

function correoCambioContrasenia(req, res) {


    console.log(" datos que entraro a correo de cambio de contrasenia  ", req.body);
    let token = jwt.createToken24h(req.body);

    var mailOptions = {
        from: 'doginotificaciones@gmail.com',
        to: req.body.CORREO,
        subject: 'Cambio de contraseña',
        text: 'Hola' + req.body.NOMBRE + ', Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para poder cambiar su contraseña: http://localhost:4200/olvido-contrasenia-paso2/' + token,
        html: 'Hola<strong> ' + req.body.NOMBRE + '</strong>,<br><br>Gracias por registrarte en "COMDERO". ' +
            'Porfavor da click en el siguiente link para poder cambiar su contraseña:<br><br>' +
            '<a href="http://localhost:4200/olvido-contrasenia-paso2/' + token + '">' +
            'http://localhost:4200/olvido-contrasenia-paso2/</a>'

    };


    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
            res.status(500).send({
                message: "Al parecer existe un error intentelo nuevamente" + error
            });
        } else {

            res.status(200).send({
                message: "El correo ha sido enviado porfavor verifiquelo"
            });
        }
    });


}


function correoCambioCorreo(req, res) {

    console.log(" datos que entraro a correo de cambio de contrasenia  ", req.body);
    var mailOptions = {
        from: 'doginotificaciones@gmail.com',
        to: req.body.correo,
        subject: 'Cambio de correo',
        text: 'Tu código de verificación es ' + req.body.codigo,

    };

    transporter.sendMail(mailOptions, function (error) {
        if (error) {
            console.log(error);
            res.status(500).send({
                message: "Al parecer existe un error intentelo nuevamente" + error
            });
        } else {
            res.status(200).send({
                message: "El correo ha sido enviado porfavor verifiquelo"
            });
        }
    });


}


module.exports = {
    correoActivacion,
    correoCambioContrasenia,
    correoCambioCorreo
};
