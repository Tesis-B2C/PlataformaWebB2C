'use strict'
var jwt = require('jwt-simple');
var moment = require('moment'); // ayuda a que se regisrtere feha de inicio y de expiracion de la creacion del token
var secret = 'clave_secreta_curso';

exports.createToken = function (user) {
    var payload = {
        sub: user.id_Agente,// para guardar el id del objeto usuario  -----leer esto esta diciendo que nomas va en el hash codificado
        mane: user.nombre,
        email: user.correo,
        tipo: user.tipo,
        image: user.image,
        iat: moment().unix(), // fechar creacion del token
        exp: moment().add(200, 'days').unix
    }

    return jwt.encode(payload, secret)
}
