'use strict'

const bcrypt = require('bcrypt-nodejs');
const moment = require('moment');
const AGENTE = require('../models/agente'); //importar el modelo del usuario  o lo que son las clases comunesvar DPA = require('../models/dpa'); //importar el modelo del usuario  o lo que son las clases comunes
const jwt = require('../services/jwt');
const correo = require('./correo');
const DPA = require('../models/dpa');

async function registrarAgente(req, res) {
    try {

        let agenteEncontrado = await AGENTE.findOne({where: {CORREO: req.body.Correo}});

        if (agenteEncontrado) {
            res.status(404).send({
                message: 'Este correo electronico ya esta vinculado a una cuenta'
            });
        } else {

            console.log("params", req.body);
            let agente = AGENTE.build();
            agente.ID_AGENTE = req.body.Id_Agente;
            agente.NOMBRE = req.body.Nombre;
            agente.TELEFONO = req.body.Telefono;
            agente.CORREO = req.body.Correo;
            agente.NUM_COD_POSTAL = req.body.Num_Cod_Postal;
            agente.TIPO = req.body.Tipo;
            agente.ESTADO = req.body.Estado;
            agente.CALLE_PRINCIPAL_AGENTE = req.body.Calle_Principal_Agente;
            agente.CALLE_SECUNDARIA_AGENTE = req.body.Calle_Secundaria_Agente;
            agente.NUM_CASA_AGENTE = req.body.Num_Casa_Agente;
            agente.COD_DPA = req.body.Ciudad;
            await bcrypt.hash(req.body.Contrasenia, null, null, function (err, hash) {
                agente.CONTRASENIA = hash;
            });
            let agenteGuardado = await agente.save();
            if (agenteGuardado) {
                let TOKENTEMPORAL = jwt.createToken24h(agente);
                let respuestaCorreo = await correo.EnviarCorreo(agente.CORREO, 'Activación de cuenta', agente.NOMBRE, TOKENTEMPORAL);

                if (respuestaCorreo == false) {
                   // agente.destroy({where: {CORREO: agente.CORREO}});
                    res.status(500).send({
                        message: 'Parece que hay un error en el correo electrónico intentalo más tarde'
                    });
                } else if (req.body.Num_Cod_Postal) {
                    res.status(200).send({
                        message: 'Por favor revisa tu correo electrónico para activar tu cuenta'
                    });
                } else {
                    res.status(200).send({
                        message: 'No se ha registrado una dirección aun, esperamos lo puedas hacer pronto,' +
                            'Porfavor revisa tu correo electrónico: ' + agente.CORREO + '  para activar tu cuenta'
                    });
                }
            } else {
                res.status(500).send({
                    message: 'No se han podido registrar tus datos intenta nuevamente'
                });
            }
        }


    } catch (err) {
        res.status(500).send({
            message: err.name
        });
    }


}


async function autenticarAgente(req, res) {
    try {
        let params = req.body;
        let correo = params.Correo;
        let contrasenia = params.Contrasenia;
        let agente = await AGENTE.findOne({
            where: {ESTADO: '0', CORREO: correo},
            include: {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}
        });
        if (!agente) {
            res.status(404).send({message: 'El Usuario no existe o no esta activado'});
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
        let params = req.body;
        let correo = params.Correo;
        let contrasenia = params.Contrasenia;

        if (correo != req.user.email) {
            res.status(500).send({
                message: "token no valido"
            });
        } else {
            let agente = await AGENTE.findOne({where: {ESTADO: '1', CORREO: req.user.email}});
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
        let params = req.body;
        let agente = await AGENTE.findOne({where: {ESTADO: '0', CORREO: params.Correo}});
        if (!agente) {
            res.status(404).send({
                message: 'Usuario no encontrado'
            });
        } else {
            let TOKENTEMPORAL = jwt.createToken24h(agente.dataValues);
            let respuestaCorreo = await correo.EnviarCorreo(agente.dataValues.CORREO, 'Cambio de contraseña', agente.dataValues.NOMBRE, TOKENTEMPORAL);

            // Function to send e-mail to the user
            if (respuestaCorreo == 'error') {
                res.status(500).send({
                    message: 'Al parecer existe un problema intentalo más tarde'
                });
            } else {
                res.status(200).send({
                    message: 'Por favor revisa tu correo electrónico para resetear tu contraseña'
                });
            }
        }
    } catch (e) {
        res.status(500).send({
            message: err.name
        });
    }

}

async function resetearContrasenia2(req, res) {

    try {
        let agente = await AGENTE.findOne({where: {ESTADO: '0', CORREO: req.user.email}});
        if (!agente) {
            res.status(500).send({
                message: "token no valido"
            });
        } else {

            await bcrypt.hash(req.body.Contrasenia2, null, null, function (err, hash) {
                let nuevaContrasenia = hash;//aqui e cambio
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

async function actualizarAgente(req, res) {
    try {
        let agenteId = req.params.id;
        let agente = {
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
            COD_DPA: req.body.Ciudad

        }
        let agenteActualizado = await AGENTE.update(agente, {where: {ESTADO: '0', CORREO: agenteId}});
        if (!agenteActualizado.length) {
            res.status(404).send({message: 'El Usuario no ha sido actualizado'});
        } else {
            res.status(200).send({message: 'El Usuario ha sido actualizado'});
        }
    } catch (e) {
        res.status(500).send({
            message: err.name
        });
    }
}


async function verificarExistenciaCorreo(req, res) {
    try {
        let agenteEncontrado = await AGENTE.findOne({where: {CORREO: req.body.correo}});

        if (agenteEncontrado) {
            res.status(404).send({
                message: 'Este correo electronico ya esta vinculado a una cuenta'
            });
        } else {
            let respuestaCorreo = await correo.EnviarCorreo(req.body.correo, req.body.asunto, req.body.codigo, null);
            if (respuestaCorreo == false) {
                agente.destroy({where: {CORREO: req.body.correo}});
                res.status(500).send({
                    message: 'Parece que hay un error en el correo electrónico intentalo más tarde'
                });
            } else {
                res.status(200).send({
                    message: 'Por favor revisa tu correo electrónico'
                });
            }
        }
    } catch (err) {
        res.status(500).send({
            message: err.name
        });
    }
}

async function cambioCorreoAgente(req, res) {
    try {
        let agenteId = req.params.id;
        let agente = await AGENTE.findOne({where: {ESTADO: '0', CORREO: agenteId}});
        let agenteActualizado = await agente.update({CORREO: req.body.correo});
        if (!agenteActualizado) {
            res.status(404).send({message: 'El Usuario no ha sido actualizado'});
        } else {
            res.status(200).send({message: 'El Usuario ha sido actualizado'});
        }
    } catch (e) {
        res.status(500).send({
            message: err.name
        });
    }
}

async function actualizarAgenteIdentity(req, res) {
    let busqueda = req.params.id;

    try {
        let agente = await AGENTE.findOne({
            where: {ESTADO: '0', CORREO: busqueda},
            include: {model: DPA, include: {model: DPA, as: 'DPAP', required: true}}
        });

        if (agente) {
            res.status(200).send({
                data: agente,
            });
        } else {
            res.status(404).send({
                message: 'No se pudieron recargar sus datos puede probar auntenticandose nuevamente'
            });


        }
    } catch (err) {
        res.status(500).send({
            message: 'error:' + err
        });
    }
}

async function actualizarContrasenia(req, res) {

    try {
        let agenteId = req.params.id;

        console.log(req.body);
        let agente = await AGENTE.findOne({where: {ESTADO: '0', CORREO: agenteId}});
        let result = await bcrypt.compareSync(req.body.contraseniaActual, agente.dataValues.CONTRASENIA);
        if (result) {

            await bcrypt.hash(req.body.contraseniaNueva, null, null, async function (err, hash) {
                let agenteActualizado = await agente.update({CONTRASENIA: hash});
                if (!agenteActualizado) {
                    res.status(404).send({message: 'No se ha podido actualizar la contraseña'});
                } else {
                    res.status(200).send({message: 'La contraseña ha sido actualizada'});
                }
            });
        } else {
            res.status(404).send({
                message: 'La contraseña actual no coincide'
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
    resetearContrasenia2,
    actualizarAgente,
    verificarExistenciaCorreo,
    cambioCorreoAgente,
    actualizarAgenteIdentity,
    actualizarContrasenia
};
