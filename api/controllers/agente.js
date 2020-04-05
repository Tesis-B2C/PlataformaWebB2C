'use strcit'

var bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
var AGENTE = require('../models/agente'); //importar el modelo del usuario  o lo que son las clases comunes
var CODIGO_POSTAL = require('../models/codigo_postal'); //importar el modelo del usuario  o lo que son las clases comunes
var jwt = require('../services/jwt');
var mysql = require('mysql');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'doginotificaciones@gmail.com',
        pass: 'dogi12345.'
    }
});

async function registrarAgente(req, res) {
    try {
        let datosAgente = {
            ID_AGENTE: req.body.Id_Agente,
            NOMBRE: req.body.Nombre,
            TELEFONO: req.body.Telefono,
            CORREO: req.body.Correo,
            NUM_COD_POSTAL: req.body.Num_Cod_Postal,
            TIPO: req.body.Tipo,
            ESTADO: req.body.Estado,
            CALLE_PRINCIPAL_AGENTE: req.body.Calle_Principal_Agente,
            CALLE_SECUNDARIA_AGENTE: req.body.Calle_Secundaria_Agente,
            NUM_CASA_AGENTE: req.body.Num_Casa_Agente,
            CONTRASENIA: req.body.Contrasenia
        }

        let datosCodigoPostal = {
            NUM_COD_POSTAL: req.body.Num_Cod_Postal,
            COD_DPA: req.body.Ciudad
        }

        await bcrypt.hash(req.body.Contrasenia, null, null, function (err, hash) {
            datosAgente.CONTRASENIA = hash;
        });

        await AGENTE.findOrCreate({
            where: {CORREO: req.body.Correo}, defaults: datosAgente // default se pone cuando no se compara todos los parametros anterior mente
        }).spread(function (agente, creado) {
            if (creado) {
                if (req.body.Num_Cod_Postal != null) {
                    CODIGO_POSTAL.findOrCreate({
                        where: {NUM_COD_POSTAL: req.body.Num_Cod_Postal, COD_DPA: req.body.Ciudad}, datosCodigoPostal // aqui no se poen default por que comparamos el objeto entero
                    }).spread(function (codigo_postal, creado) {
                        if (creado || !creado) {
                            let TOKENTEMPORAL = jwt.createToken24h(agente.dataValues);
                            // agente.create();
                            var mailOptions = {
                                from: 'doginotificaciones@gmail.com',
                                to: agente.dataValues.CORREO,
                                subject: 'Activación de cuenta',
                                text: 'Hola' + agente.dataValues.NOMBRE + ', Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para completar la activacion: http://localhost:4200/loguin/' + TOKENTEMPORAL,
                                html: 'Hola<strong> ' + agente.dataValues.NOMBRE + '</strong>,<br><br>Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para completar la activacion:<br><br><a href="http://localhost:4200/loguin/' + TOKENTEMPORAL + '">http://localhost:4200/loguin/</a>'
                            };
                            // Function to send e-mail to the user
                            transporter.sendMail(mailOptions, function (error) {
                                if (error) {
                                    console.log(error);
                                    res.send(500, err.message);
                                } else {
                                    console.log("Email sent");
                                    res.status(200).send({
                                        message: 'Porfavor revisa tu correo electronico para activar tu cuenta '
                                    });
                                }
                            });
                        }
                    });
                } else {
                    let TOKENTEMPORAL = jwt.createToken24h(agente.dataValues);
                    // agente.create();
                    var mailOptions = {
                        from: 'doginotificaciones@gmail.com',
                        to: agente.dataValues.CORREO,
                        subject: 'Activación de cuenta',
                        text: 'Hola' + agente.dataValues.NOMBRE + ', Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para completar la activacion: http://localhost:4200/loguin/' + TOKENTEMPORAL,
                        html: 'Hola<strong> ' + agente.dataValues.NOMBRE + '</strong>,<br><br>Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para completar la activacion:<br><br><a href="http://localhost:4200/loguin/' + TOKENTEMPORAL + '">http://localhost:4200/loguin/</a>'
                    };
                    // Function to send e-mail to the user
                    transporter.sendMail(mailOptions, function (error) {
                        if (error) {
                            console.log(error);
                            res.send(500, err.message);
                        } else {
                            console.log("Email sent");
                            res.status(200).send({
                                message: 'Porfavor revisa tu correo electronico para activar tu cuenta '
                            });
                        }
                    });
                    res.status(200).send({
                        message: 'No se ha registrado una direccion aun, esperamos lo puedas hacer pronto'
                    });
                }
            } else {
                res.status(404).send({
                    message: 'Este correo electronico ya esta vinculado a una cuenta'
                });
            }
        });

    } catch (err) {
        res.status(500).send({
            message: err.name
        });
    }
}


async function autenticarAgente(req, res) {
    try {
        var params = req.body;
        var correo = params.Correo;
        var contrasenia = params.Contrasenia;
        let agente = await AGENTE.findOne({where: {ESTADO: '0', CORREO: correo}});
        if (!agente) {
            res.status(404).send({message: 'El Usuario no existe'});
        } else {
            let result = bcrypt.compareSync(contrasenia, agente.dataValues.CONTRASENIA);
            if (result) {
                if (params.getHash) {
                    res.status(200).send({token: jwt.createToken(agente.dataValues)});
                } else {
                    res.status(200).send({
                        data: agente
                    });
                }
            } else {
                res.status(404).send({message: 'Error al ingresar, contraseña incorrecta.'});
            }
        }

    } catch (err) {
        res.status(500).send({
            message: err.name
        });
    }
}


async function autenticarActivarAgente(req, res) {
    try {
        var params = req.body;
        var correo = params.Correo;
        var contrasenia = params.Contrasenia;

        if (correo != req.user.email) {
            res.status(500).send({
                message: "token no valido"
            });
        } else {
            let agente = await AGENTE.findOne({where: {CORREO: req.user.email}});
            if (!agente) {
                res.status(500).send({
                    message: "Al parecer el usuario no ha sido registrado"
                });
            } else {
                let agenteActualizado = agente.update({ESTADO: "0"});
                if (!agenteActualizado) {
                    res.status(404).send({message: 'El Usuario no ha sido activado'});
                } else {
                    let result = bcrypt.compareSync(contrasenia, agente.dataValues.CONTRASENIA);
                    if (result) {
                        if (params.getHash) {
                            res.status(200).send({token: jwt.createToken(agente.dataValues)});
                        } else {
                            res.status(200).send({
                                data: agente
                            });
                        }
                    } else {
                        res.status(404).send({message: 'Error, contraseña incorrecta.'});
                    }
                }
            }
        }
    } catch (err) {
        res.status(500).send({
            message: err.name
        });
    }
}


async function resetearContrasenia(req, res) {
    try {
        var params = req.body;
        let agente = await AGENTE.findOne({where: {ESTADO: '0', CORREO: params.Correo}});
        if (!agente) {
            res.status(404).send({
                message: 'Usuario no encontrado'
            });
        } else {
            let TOKENTEMPORAL = jwt.createToken24h(agente.dataValues);
            // agente.create();
            var mailOptions = {
                from: 'doginotificaciones@gmail.com',
                to: agente.dataValues.CORREO,
                subject: 'Cambio de contraseña',
                text: 'Hola' + agente.dataValues.NOMBRE + ', Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para poder cambiar su contraseña: http://localhost:4200/olvido-contrasenia-paso2/' + TOKENTEMPORAL,
                html: 'Hola<strong> ' + agente.dataValues.NOMBRE + '</strong>,<br><br>Gracias por registrarte en "COMDERO". Porfavor da click en el siguiente link para poder cambiar su contraseña:<br><br><a href="http://localhost:4200/olvido-contrasenia-paso2/' + TOKENTEMPORAL + '">http://localhost:4200/olvido-contrasenia-paso2/</a>'
            };
            // Function to send e-mail to the user
            transporter.sendMail(mailOptions, function (error) {
                if (error) {
                    res.send(500, err.message);
                } else {
                    res.status(200).send({
                        message: 'Porfavor revisa tu correo electronico para resetear tu contraseña'
                    });
                }
            });

        }
    } catch (e) {
        res.status(500).send({
            message: err.name
        });
    }

}

async function resetearContrasenia2(req, res) {

    try {
        let agente = await AGENTE.findOne({where: {CORREO: req.user.email}});
        if (!agente) {
            res.status(500).send({
                message: "token no valido"
            });
        } else {
            var nuevaContrasenia;
            await bcrypt.hash(req.body.Contrasenia2, null, null, function (err, hash) {
                nuevaContrasenia = hash;
                let agenteActualizado = agente.update({CONTRASENIA: nuevaContrasenia});
                if (!agenteActualizado) {
                    res.status(500).send({
                        message: "La contrasenña no pudo ser actualizada"
                    });
                } else {
                    res.status(200).send({
                        message: "Tu contraseña ha sido actualizada"
                    });
                }
            });
        }
    } catch (e) {
        res.status(500).send({
            message: err.name
        });
    }
}

module.exports = {          // para exportar todas las funciones de este modulo

    registrarAgente,
    autenticarAgente,
    autenticarActivarAgente,
    resetearContrasenia,
    resetearContrasenia2
};
